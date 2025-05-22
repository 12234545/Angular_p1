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

from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

import json
import os
import re

# Créer un dossier pour stocker les informations structurées sur la plateforme
os.makedirs("platform_data", exist_ok=True)

# Informations structurées sur la plateforme CLIK2LEARN
platform_info = {
    "name": "CLICK2LEARN",
    "description": "Plateforme innovante de formation institutionnelle qui permet aux utilisateurs d'apprendre de manière interactive.",
    "user_types": [
        {
            "type": "formateur",
            "capabilities": [
                "Concevoir et gérer des cours en ligne",
                "Stocker les supports pédagogiques",
                "Gérer les devoirs, quiz et examens",
                "Suivre les échéances",
                "Attribuer des notes",
                "Créer des classes virtuelles"
            ]
        },
        {
            "type": "apprenant",
            "capabilities": [
                "Accéder aux cours via code d'accès",
                "Participer aux sessions virtuelles",
                "Recevoir des certificats à la fin des formations",
                "Obtenir des feedbacks et évaluations"
            ]
        }
    ],
    "features": [
        {
            "name": "Gestion de cours",
            "description": "Création et gestion complète des cours et des ressources pédagogiques"
        },
        {
            "name": "Classes virtuelles",
            "description": "Salles de classe virtuelles via un système cloud sécurisé"
        },
        {
            "name": "Planification",
            "description": "Système interactif pour planifier les sessions sur un ou plusieurs jours"
        },
        {
            "name": "Certification",
            "description": "Certificats personnalisés générés automatiquement à la fin de chaque formation"
        },
        {
            "name": "Suivi et évaluation",
            "description": "Génération automatique de feedbacks et évaluations après chaque formation"
        }
    ],
    "navigation": {
        "main_pages": [
            {
                "name": "Accueil",
                "path": "/accueil",
                "description": "Page principale avec présentation de la plateforme"
            },
            {
                "name": "Cours",
                "path": "/cours",
                "description": "Catalogue de cours disponibles sur la plateforme"
            },
            {
                "name": "Les établissements",
                "path": "/etablissements",
                "description": "Liste des établissements partenaires"
            },
            {
                "name": "À propos de nous",
                "path": "/apropos",
                "description": "Information sur l'équipe et la mission de CLIK2LEARN"
            }
        ],
        "auth_pages": [
            {
                "name": "Se connecter",
                "path": "/login",
                "description": "Page de connexion pour utilisateurs existants"
            },
            {
                "name": "S'inscrire",
                "path": "/register",
                "description": "Page d'inscription pour nouveaux utilisateurs"
            }
        ]
    },
    "stats": {
        "students": "250k",
        "success_rate": "75%",
        "major_questions": "35",
        "experts": "26",
        "years_experience": "16"
    },
    "partners": ["MOOC", "Udemy", "Coursera", "edX"]
}

# Sauvegarde des informations structurées
with open("platform_data/platform_info.json", "w", encoding="utf-8") as f:
    json.dump(platform_info, f, ensure_ascii=False, indent=4)

# Création d'un document à partir des informations structurées
platform_text = f"""
CLIK2LEARN - PLATEFORME DE FORMATION INSTITUTIONNELLE

Description: {platform_info['description']}

UTILISATEURS:
1. Formateurs peuvent: {', '.join(platform_info['user_types'][0]['capabilities'])}
2. Apprenants peuvent: {', '.join(platform_info['user_types'][1]['capabilities'])}

FONCTIONNALITÉS PRINCIPALES:
{chr(10).join([f"- {feature['name']}: {feature['description']}" for feature in platform_info['features']])}

NAVIGATION SUR LA PLATEFORME:
Pages principales: {', '.join([page['name'] for page in platform_info['navigation']['main_pages']])}
Pages d'authentification: {', '.join([page['name'] for page in platform_info['navigation']['auth_pages']])}

STATISTIQUES:
- {platform_info['stats']['students']} étudiants assistés
- {platform_info['stats']['success_rate']} taux de réussite
- {platform_info['stats']['major_questions']} questions principales traitées
- {platform_info['stats']['experts']} experts disponibles
- {platform_info['stats']['years_experience']} années d'expérience

PARTENAIRES:
{', '.join(platform_info['partners'])}

La plateforme permet aux éducateurs de concevoir et gérer des cours en ligne, de stocker les supports pédagogiques,
de gérer les devoirs, quiz et examens, de suivre les échéances et d'attribuer des notes, le tout sur un seul outil.
"""

# Chargement des documents PDF
pdf_folder = Path("pdf/")
documents = []

for pdf_file in pdf_folder.glob("*.pdf"):
    loader = PyPDFLoader(str(pdf_file))
    documents.extend(loader.load())

# Ajout des informations de la plateforme
platform_doc = Document(page_content=platform_text)
documents.append(platform_doc)

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

# Prompts modifiés pour des réponses plus directes sans introductions formelles
rag_template_fr = """Tu es Formito, l'assistant de la plateforme CLICK2LEARN. Réponds de manière directe et concise, sans introduire tes réponses par des formules comme "## Introduction" ou "Bonjour, je suis Formito".

INFORMATIONS SUR LA PLATEFORME:
- CLIK2LEARN est une plateforme de formation institutionnelle interactive
- Elle permet aux formateurs de concevoir/gérer des cours, stocker des supports, gérer devoirs/quiz/examens, suivre échéances, attribuer notes
- Les apprenants peuvent accéder aux cours via codes d'accès, participer aux sessions virtuelles, et recevoir des certificats
- La plateforme propose des classes virtuelles via un système cloud sécurisé
- Les formateurs peuvent créer des classes et planifier des sessions sur plusieurs jours
- Des certificats personnalisés sont générés automatiquement en fin de formation
- Le système génère automatiquement feedbacks et évaluations après chaque formation

Historique de conversation: {history}
Connaissances contextuelles: {context}
Question de l'utilisateur: {question}

Consignes TRÈS IMPORTANTES:
- Sois direct et va droit à l'essentiel
- Ne commence JAMAIS tes réponses par "## Introduction" ou des titres similaires
- Ne te présente pas à chaque fois
- Ne structure pas tes réponses avec des titres ou en-têtes (pas de ## ou ###)
- Pour les questions techniques, donne directement les informations utiles
- Utilise un ton naturel et conversationnel
- Adapte la longueur de ta réponse à la complexité de la question
- Réponds dans la même langue que l'utilisateur
- Évite de structurer ta réponse en sections
"""

rag_template_en = """You are Formito, the assistant for the CLICK2LEARN platform. Respond directly and concisely, without introducing your answers with phrases like "## Introduction" or "Hello, I'm Formito".

PLATFORM INFORMATION:
- CLIK2LEARN is an interactive institutional training platform
- It allows instructors to design/manage courses, store materials, manage assignments/quizzes/exams, track deadlines, assign grades
- Learners can access courses via access codes, participate in virtual sessions, and receive certificates
- The platform offers virtual classrooms via a secure cloud system
- Instructors can create classes and schedule sessions over multiple days
- Personalized certificates are automatically generated at the end of training
- The system automatically generates feedback and evaluations after each training

Conversation history: {history}
Contextual knowledge: {context}
User question: {question}

VERY IMPORTANT guidelines:
- Be direct and get straight to the point
- NEVER start your responses with "## Introduction" or similar headings
- Don't introduce yourself each time
- Don't structure your responses with headings or titles (no ## or ###)
- For technical questions, directly provide useful information
- Use a natural, conversational tone
- Adapt the length of your response to the complexity of the question
- Respond in the same language as the user
- Avoid structuring your response into sections
"""

rag_template_ar = """أنت فورميتو، مساعد منصة CLICK2LEARN. قم بالرد بشكل مباشر وموجز، دون تقديم إجاباتك بعبارات مثل "## مقدمة" أو "مرحبًا، أنا فورميتو".

معلومات عن المنصة:
- CLIK2LEARN هي منصة تدريب مؤسسي تفاعلية
- تتيح للمدربين تصميم/إدارة الدورات، وتخزين المواد، وإدارة الواجبات/الاختبارات/الامتحانات، وتتبع المواعيد النهائية، وتعيين الدرجات
- يمكن للمتعلمين الوصول إلى الدورات عبر رموز الوصول، والمشاركة في الجلسات الافتراضية، والحصول على الشهادات
- توفر المنصة فصولًا افتراضية عبر نظام سحابي آمن
- يمكن للمدربين إنشاء فصول وجدولة جلسات على مدار عدة أيام
- يتم إنشاء شهادات مخصصة تلقائيًا في نهاية التدريب
- يقوم النظام تلقائيًا بإنشاء ملاحظات وتقييمات بعد كل تدريب

سجل المحادثة: {history}
المعرفة السياقية: {context}
سؤال المستخدم: {question}

إرشادات مهمة جدًا:
- كن مباشرًا واذهب إلى صميم الموضوع
- لا تبدأ إجاباتك أبدًا بـ "## مقدمة" أو عناوين مماثلة
- لا تقدم نفسك في كل مرة
- لا تقم بهيكلة إجاباتك بعناوين (لا تستخدم ## أو ###)
- بالنسبة للأسئلة التقنية، قدم المعلومات المفيدة مباشرة
- استخدم نبرة طبيعية ومحادثة
- قم بتكييف طول ردك مع تعقيد السؤال
- الرد بنفس لغة المستخدم
- تجنب هيكلة ردك في أقسام
"""

# Configuration du modèle de réponse
llm_response = ChatGroq(
    temperature=0.3,  # Légèrement plus élevé pour des réponses plus naturelles
    api_key="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",
    model="llama-3.3-70b-versatile"
)

# Mémoire de conversation améliorée avec plus de contexte
memory = ConversationBufferMemory(memory_key="history", return_messages=False, max_token_limit=2000)

# Fonction de détection de langue
def detect_language(text):
    try:
        lang = detect(text)
        return lang
    except:
        return "fr"  # Par défaut en français

# Fonction pour identifier l'intention de l'utilisateur
def identify_intent(query):
    # Patrons pour différentes intentions
    intent_patterns = {
        "greeting": r"\b(bonjour|salut|hello|hi|hey|coucou|bonsoir|مرحبا|السلام عليكم)\b",
        "platform_info": r"\b(plateforme|platform|qu'est.ce.que|c'est quoi|fonctionnalités|features|منصة)\b",
        "account": r"\b(compte|s'inscrire|se connecter|inscription|connexion|login|register|sign up|sign in|حساب|تسجيل)\b",
        "courses": r"\b(cours|course|formation|class|training|دورة|تدريب)\b",
        "technical_help": r"\b(problème|bug|erreur|aide|problem|error|help|مشكلة|مساعدة)\b",
        "navigation": r"\b(trouver|find|où|where|page|section|كيف أجد)\b",
        "features": r"\b(fonctionnalit|feature|outil|tool|option|أداة|ميزة)\b",
        "price": r"\b(prix|tarif|cost|price|fee|تكلفة|سعر)\b"
    }

    query_lower = query.lower()
    detected_intents = []

    for intent, pattern in intent_patterns.items():
        if re.search(pattern, query_lower):
            detected_intents.append(intent)

    if not detected_intents:
        return "general_question"

    return detected_intents[0] if len(detected_intents) == 1 else "multiple_intents"

# Fonction pour récupérer du contexte
def retrieve_context(query, intent=None):
    # Enrichissement de la requête en fonction de l'intention
    enhanced_query = query

    if intent == "platform_info":
        enhanced_query = f"{query} CLIK2LEARN plateforme formation institutionnelle fonctionnalités"
    elif intent == "account":
        enhanced_query = f"{query} compte utilisateur inscription connexion CLIK2LEARN"
    elif intent == "courses":
        enhanced_query = f"{query} cours formation CLIK2LEARN catalogue"
    elif intent == "technical_help":
        enhanced_query = f"{query} aide support technique problème CLIK2LEARN"
    elif intent == "navigation":
        enhanced_query = f"{query} navigation pages sections CLIK2LEARN"
    elif intent == "features":
        enhanced_query = f"{query} fonctionnalités outils options services CLIK2LEARN"
    elif intent == "price":
        enhanced_query = f"{query} prix tarifs coûts CLIK2LEARN"

    docs = advanced_retriever.get_relevant_documents(enhanced_query)
    return "\n\n".join([f"- {doc.page_content}" for doc in docs])

# Fonction pour analyser le sentiment de la requête
def analyze_sentiment(text):
    # Mots positifs
    positive_words = [
        "bien", "good", "excellent", "super", "génial", "awesome", "great", "merci",
        "thanks", "j'aime", "like", "love", "parfait", "perfect", "جيد", "ممتاز", "شكرا"
    ]

    # Mots négatifs
    negative_words = [
        "mauvais", "bad", "terrible", "problème", "problem", "erreur", "error", "bug",
        "lent", "slow", "difficile", "difficult", "compliqué", "complicated", "سيء", "مشكلة", "صعب"
    ]

    text_lower = text.lower()

    # Compter les correspondances
    positive_count = sum(1 for word in positive_words if word in text_lower)
    negative_count = sum(1 for word in negative_words if word in text_lower)

    # Déterminer le sentiment
    if positive_count > negative_count:
        return "positive"
    elif negative_count > positive_count:
        return "negative"
    else:
        return "neutral"

# Fonction principale de génération de réponse améliorée
def generate_response(user_message, response_format="default"):
    conversation_history = memory.buffer

    # Détection de la langue
    user_language = detect_language(user_message)

    # Identification de l'intention
    intent = identify_intent(user_message)

    # Récupération du contexte adapté à l'intention
    context = retrieve_context(user_message, intent)

    # Analyse du sentiment
    sentiment = analyze_sentiment(user_message)

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

    # Détecter si c'est une salutation simple
    simple_greetings_fr = ["bonjour", "salut", "bonsoir", "hello", "coucou", "hey", "ça va", "comment ça va", "merci"]
    simple_greetings_en = ["hello", "hi", "hey", "good morning", "good evening", "thanks", "thank you", "how are you"]
    simple_greetings_ar = ["مرحبا", "السلام عليكم", "صباح الخير", "مساء الخير", "شكرا"]

    is_simple_greeting = False

    # Conversion en minuscule pour la comparaison
    user_message_lower = user_message.lower().strip()

    # Vérifier si c'est une salutation simple
    if (user_language == "fr" and any(greeting == user_message_lower or greeting in user_message_lower.split() for greeting in simple_greetings_fr)) or \
       (user_language == "en" and any(greeting == user_message_lower or greeting in user_message_lower.split() for greeting in simple_greetings_en)) or \
       (user_language == "ar" and any(greeting == user_message_lower or greeting in user_message_lower.split() for greeting in simple_greetings_ar)):
        if len(user_message_lower.split()) <= 5:  # Si le message contient 5 mots ou moins
            is_simple_greeting = True

    # Adaptation des instructions pour éviter toute introduction ou formatage avec des titres
    format_instruction = "\nNe commence JAMAIS par une introduction ou un en-tête. Ne te présente pas. Va droit à l'essentiel."

    if is_simple_greeting:
        format_instruction = "\nRéponds de manière très brève et naturelle sans te présenter (1 phrase maximum)."
    else:
        if intent == "platform_info":
            format_instruction += "\nDonne directement les informations sur la plateforme sans introduction."
        elif intent == "account":
            format_instruction += "\nExplique directement les étapes pour s'inscrire ou se connecter sans introduction."
        elif intent == "courses":
            format_instruction += "\nDonne directement les informations sur les cours sans introduction."
        elif intent == "technical_help":
            format_instruction += "\nPropose directement des solutions sans introduction."
        elif intent == "navigation":
            format_instruction += "\nGuide directement l'utilisateur vers la section appropriée sans introduction."

        if sentiment == "negative":
            format_instruction += "\nMontre de l'empathie mais reste direct et concis."
        elif sentiment == "positive":
            format_instruction += "\nAdopte un ton positif tout en restant direct et concis."

    # Instruction supplémentaire pour éviter les structures avec ## ou ###
    format_instruction += "\nIMPORTANT: N'utilise PAS de titres avec ## ou ### dans ta réponse. Écris en paragraphes simples."

    modified_question = f"{language_instruction}{format_instruction}\n\n{user_message}"

    prompt = selected_prompt.format(
        history=conversation_history,
        context=context,
        question=modified_question
    )

    # Sauvegarde de la température originale
    temp_original = llm_response.temperature

    # Modifier la température en fonction du type de question
    if is_simple_greeting:
        llm_response.temperature = 0.4  # Légèrement plus créatif pour les salutations
    else:
        if intent in ["technical_help", "account"]:
            llm_response.temperature = 0.2  # Plus précis pour l'aide technique
        else:
            llm_response.temperature = 0.3  # Normal pour les autres questions

    # Envoyer la requête au modèle
    response = llm_response.invoke([HumanMessage(content=prompt)]).content

    # Nettoyage des réponses pour supprimer tout format de titre restant
    response = re.sub(r'^##?\s+.*$', '', response, flags=re.MULTILINE)
    response = re.sub(r'^Introduction\s*:?\s*', '', response, flags=re.MULTILINE | re.IGNORECASE)
    response = response.strip()

    # Restaurer la température originale
    llm_response.temperature = temp_original

    # Enregistrement dans la mémoire
    memory.save_context({"input": user_message}, {"output": response})

    return response

# Traitement OCR (image vers texte)
ocr = PaddleOCR(use_angle_cls=True, lang='fr')

# Traitement des images existantes
image_paths = Path("image/").glob("*.png")
for img_path in image_paths:
    results = ocr.ocr(str(img_path), cls=True)

    text_from_image = ""
    if results and results[0] is not None:
        for line in results[0]:
            text_line = line[1][0]
            text_from_image += text_line + "\n"

    # Création d'un document à partir du texte extrait
    if text_from_image:
        doc_from_image = Document(page_content=f"Texte extrait de {img_path.name}: {text_from_image}")
        image_chunks = text_splitter.split_documents([doc_from_image])
        vectorstore.add_texts([chunk.page_content for chunk in image_chunks])

# Configuration de l'API FastAPI
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
    user_id: str = None  # Identifiant optionnel pour personnalisation

class FeedbackMessage(BaseModel):
    message_id: str
    feedback: str  # 'positive' ou 'negative'
    comment: str = None

@app.post("/api/chat")
async def chat(request: ChatMessage):
    if not request.message:
        raise HTTPException(status_code=400, detail="Le message ne peut pas être vide")

    user_message = request.message
    response_format = request.format

    try:
        response = generate_response(user_message, response_format)
        return {
            "response": response,
            "message_id": id(response),  # Identifiant simple pour le suivi du feedback
            "intent_detected": identify_intent(user_message),
            "language": detect_language(user_message)
        }
    except Exception as e:
        # Réponse de secours en cas d'erreur
        return {
            "response": f"Je suis désolé, je rencontre un problème technique. Veuillez réessayer ou contacter le support à support@clik2learn.com.",
            "error": str(e)
        }

@app.post("/api/feedback")
async def feedback(feedback_data: FeedbackMessage):
    # Cette fonction pourrait être développée pour stocker les feedbacks
    # et améliorer le chatbot à l'avenir
    return {"status": "Feedback reçu, merci!"}

# Point d'entrée d'informations sur la plateforme pour permettre au frontend
# d'afficher des éléments contextuels
@app.get("/api/platform-info")
async def get_platform_info():
    return platform_info

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
