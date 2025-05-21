from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_core.vectorstores import InMemoryVectorStore
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain.memory import ConversationBufferMemory
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage
from langchain_groq import ChatGroq

import gradio as gr

from langchain_core.documents import Document
from paddleocr import PaddleOCR
from pathlib import Path
from langdetect import detect

from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

# Chargement des documents PDF
pdf_folder = Path("pdf/")
documents = []

for pdf_file in pdf_folder.glob("*.pdf"):
    loader = PyPDFLoader(str(pdf_file))
    documents.extend(loader.load())

# Découpage des documents
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(documents)

# Embedding
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# Stockage vectoriel
vectorstore = InMemoryVectorStore.from_texts(
    texts=[doc.page_content for doc in chunks],
    embedding=embeddings,
)

base_retriever = vectorstore.as_retriever(search_kwargs={"k": 8})

# Compression des documents pour retrieval avancé
llm_compression = ChatGroq(
    api_key="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",
    model="llama-3.3-70b-versatile"
)
compressor_llm = LLMChainExtractor.from_llm(llm_compression)

advanced_retriever = ContextualCompressionRetriever(
    base_compressor=compressor_llm,
    base_retriever=base_retriever
)

# Prompts multilingues modifiés pour des réponses plus naturelles
rag_template_fr = """Tu es Formito, un assistant de formation et d'orientation professionnelle. Réponds de manière naturelle et concise, adaptée au contexte de la question.

Historique : {history}
Connaissances : {context}
Question : {question}

Consignes:
- Réponds brièvement aux salutations et questions simples (1-2 phrases maximum).
- Pour les questions complexes, structure ta réponse clairement mais reste concis.
- Adapte la longueur de ta réponse à la complexité de la question.
- Ne te présente pas à chaque fois, sauf si on te le demande explicitement.
- Réponds dans la même langue que l'utilisateur.
"""

rag_template_en = """You are Formito, a training and professional guidance assistant. Respond naturally and concisely, adapting to the context of the question.

History: {history}
Knowledge: {context}
Question: {question}

Guidelines:
- Respond briefly to greetings and simple questions (1-2 sentences maximum).
- For complex questions, structure your response clearly but remain concise.
- Adapt the length of your response to the complexity of the question.
- Don't introduce yourself each time, unless explicitly asked.
- Respond in the same language as the user.
"""

rag_template_ar = """أنت فورميتو، مساعد في التدريب والتوجيه المهني. استجب بشكل طبيعي وموجز، مع التكيف مع سياق السؤال.

السجل: {history}
المعرفة: {context}
السؤال: {question}

إرشادات:
- الرد بإيجاز على التحيات والأسئلة البسيطة (جملة أو جملتين كحد أقصى).
- بالنسبة للأسئلة المعقدة، قم بهيكلة إجابتك بوضوح مع الحفاظ على الإيجاز.
- تكييف طول إجابتك مع تعقيد السؤال.
- لا تقدم نفسك في كل مرة، إلا إذا طُلب منك ذلك صراحة.
- الرد بنفس لغة المستخدم.
"""

# Configuration du modèle de réponse
llm_response = ChatGroq(
    temperature=0,
    api_key="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",
    model="llama-3.3-70b-versatile"
)

memory = ConversationBufferMemory(memory_key="history", return_messages=False)

# Fonction de détection de langue
def detect_language(text):
    try:
        lang = detect(text)
        return lang
    except:
        return "unknown"

# Fonction pour récupérer du contexte
def retrieve_context(query):
    docs = advanced_retriever.get_relevant_documents(query)
    return "\n\n".join([f"- {doc.page_content}" for doc in docs])

# Fonction principale de génération de réponse modifiée
def generate_response(user_message, response_format="default"):
    conversation_history = memory.buffer
    context = retrieve_context(user_message)

    user_language = detect_language(user_message)

    # Sélection du template selon la langue
    if user_language == "fr":
        language_instruction = "Réponds en français."
        selected_prompt = ChatPromptTemplate.from_template(rag_template_fr)
    elif user_language == "en":
        language_instruction = "Reply in English."
        selected_prompt = ChatPromptTemplate.from_template(rag_template_en)
    elif user_language == "ar":
        language_instruction = "أجب باللغة العربية."
        selected_prompt = ChatPromptTemplate.from_template(rag_template_ar)
    else:
        language_instruction = "Réponds en français."
        selected_prompt = ChatPromptTemplate.from_template(rag_template_fr)

    # Détecter si c'est une question simple (salutation, remerciement, etc.)
    simple_greetings_fr = ["bonjour", "salut", "bonsoir", "hello", "coucou", "hey", "ça va", "comment ça va", "merci"]
    simple_greetings_en = ["hello", "hi", "hey", "good morning", "good evening", "thanks", "thank you", "how are you"]
    simple_greetings_ar = ["مرحبا", "السلام عليكم", "صباح الخير", "مساء الخير", "شكرا"]

    is_simple_question = False

    # Conversion en minuscule pour la comparaison
    user_message_lower = user_message.lower().strip()

    # Vérifier si c'est une salutation simple
    if (user_language == "fr" and any(greeting in user_message_lower for greeting in simple_greetings_fr)) or \
       (user_language == "en" and any(greeting in user_message_lower for greeting in simple_greetings_en)) or \
       (user_language == "ar" and any(greeting in user_message_lower for greeting in simple_greetings_ar)):
        if len(user_message_lower.split()) <= 5:  # Si le message contient 5 mots ou moins
            is_simple_question = True

    # Ajouter une instruction spécifique pour les questions simples
    if is_simple_question:
        format_instruction = "\nC'est une salutation simple. Réponds de manière très brève et naturelle, comme dans une conversation normale (1-2 phrases maximum)."
    else:
        format_instruction = ""
        if response_format == "structured":
            format_instruction = "\nStructure ta réponse avec des titres, sous-titres, et paragraphes clairs."
        elif response_format == "paragraphs":
            format_instruction = "\nOrganise ta réponse en paragraphes distincts, chacun traitant d'un aspect spécifique de la question."

    modified_question = f"{language_instruction}{format_instruction}\n\n{user_message}"

    prompt = selected_prompt.format(
        history=conversation_history,
        context=context,
        question=modified_question
    )

    # Sauvegarde de la température originale
    temp_original = llm_response.temperature

    # Modifier la température en fonction du type de question
    if is_simple_question:
        llm_response.temperature = 0  # Pour les questions simples
    else:
        llm_response.temperature = 0.2  # Pour les questions complexes

    # Envoyer la requête au modèle
    response = llm_response.invoke([HumanMessage(content=prompt)]).content

    # Restaurer la température originale
    llm_response.temperature = temp_original

    memory.save_context({"input": user_message}, {"output": response})

    return response

# Traitement OCR (image vers texte)
ocr = PaddleOCR(use_angle_cls=True, lang='fr')
results = ocr.ocr("image/img4.png", cls=True)

text_from_image = ""
if results and results[0] is not None:
    for line in results[0]:
        text_line = line[1][0]
        text_from_image += text_line + "\n"
else:
    print("Aucun texte détecté dans l'image.")

doc_from_image = Document(page_content=text_from_image)

# Ajout du texte OCR au vectorstore
image_chunks = text_splitter.split_documents([doc_from_image])
vectorstore.add_texts([chunk.page_content for chunk in image_chunks])

app = FastAPI()

# Configuration CORS pour permettre les requêtes depuis Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # URL de votre frontend Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    format: str = "default"

@app.post("/api/chat")
async def chat(request: ChatMessage):
    user_message = request.message
    response_format = request.format
    response = generate_response(user_message, response_format)
    return {"response": response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
