import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';

interface Etablissement {
  id: number;
  nom: string;
  description: string;
  image: string;
  ville: string;
  type: string;
  nombreEtudiants: number;
  specialites: string[];
  note: number;
  accreditations: string[];
}

@Component({
  selector: 'app-etablissement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule , ChatbotComponent],
  templateUrl: './etablissement.component.html',
  styleUrls: ['./etablissement.component.scss']
})
export class EtablissementComponent implements OnInit {
  etablissements: Etablissement[] = [
    {
      id: 1,
      nom: "École Nationale Supérieure d'Ingénieurs",
      description: "Une institution d'excellence formant les ingénieurs de demain avec des programmes innovants et des équipements de pointe.",
      image: "pictures/etabs/1.png",
      ville: "Paris",
      type: "Ingénierie",
      nombreEtudiants: 2500,
      specialites: ["Informatique", "Génie Civil", "Électronique"],
      note: 4.8,
      accreditations: ["CTI", "EUR-ACE"]
    },
    {
      id: 2,
      nom: "Institut de Commerce International",
      description: "École de commerce reconnue pour ses programmes MBA et ses partenariats internationaux avec les meilleures universités.",
      image: "pictures/etabs/2.png",
      ville: "Lyon",
      type: "Commerce",
      nombreEtudiants: 1800,
      specialites: ["Marketing", "Finance", "Management"],
      note: 4.6,
      accreditations: ["AACSB", "EQUIS"]
    },
    {
      id: 3,
      nom: "Université des Sciences et Technologies",
      description: "Centre d'excellence en recherche et formation scientifique, offrant des programmes de licence au doctorat.",
      image: "pictures/etabs/3.png",
      ville: "Marseille",
      type: "Sciences",
      nombreEtudiants: 3200,
      specialites: ["Mathématiques", "Physique", "Chimie", "Biologie"],
      note: 4.7,
      accreditations: ["HCERES", "EQAR"]
    },
    {
      id: 4,
      nom: "École Supérieure d'Art et Design",
      description: "Formation artistique et créative de haut niveau, préparant aux métiers du design, de l'art et de la communication visuelle.",
      image: "pictures/etabs/4.png",
      ville: "Bordeaux",
      type: "Art & Design",
      nombreEtudiants: 950,
      specialites: ["Design Graphique", "Arts Plastiques", "Multimédia"],
      note: 4.5,
      accreditations: ["CDEFI", "CUMULUS"]
    },
    {
      id: 5,
      nom: "Institut Médical et Paramédical",
      description: "Formation médicale et paramédicale d'excellence, avec des équipements hospitaliers modernes et des partenariats cliniques.",
      image: "pictures/etabs/5.png",
      ville: "Toulouse",
      type: "Médecine",
      nombreEtudiants: 1600,
      specialites: ["Médecine", "Pharmacie", "Kinésithérapie"],
      note: 4.9,
      accreditations: ["LCME", "WFME"]
    },
    {
      id: 6,
      nom: "École de Droit et Sciences Politiques",
      description: "Formation juridique et politique de prestige, préparant aux carrières du droit, de la magistrature et de la politique.",
      image: "pictures/etabs/1.png",
      ville: "Strasbourg",
      type: "Droit",
      nombreEtudiants: 2200,
      specialites: ["Droit Civil", "Droit International", "Sciences Politiques"],
      note: 4.4,
      accreditations: ["AERES", "EUA"]
    }
  ];

  etablissementsFiltres: Etablissement[] = [];
  termRecherche: string = '';
  filtreType: string = 'tous';
  filtreVille: string = 'toutes';

  typesDisponibles: string[] = [];
  villesDisponibles: string[] = [];

  ngOnInit() {
    this.etablissementsFiltres = [...this.etablissements];
    this.extraireTypesEtVilles();
  }

  extraireTypesEtVilles() {
    this.typesDisponibles = [...new Set(this.etablissements.map(e => e.type))];
    this.villesDisponibles = [...new Set(this.etablissements.map(e => e.ville))];
  }

  filtrerEtablissements() {
    this.etablissementsFiltres = this.etablissements.filter(etablissement => {
      const matchNom = etablissement.nom.toLowerCase().includes(this.termRecherche.toLowerCase());
      const matchDescription = etablissement.description.toLowerCase().includes(this.termRecherche.toLowerCase());
      const matchSpecialites = etablissement.specialites.some(s =>
        s.toLowerCase().includes(this.termRecherche.toLowerCase())
      );

      const matchRecherche = this.termRecherche === '' || matchNom || matchDescription || matchSpecialites;
      const matchType = this.filtreType === 'tous' || etablissement.type === this.filtreType;
      const matchVille = this.filtreVille === 'toutes' || etablissement.ville === this.filtreVille;

      return matchRecherche && matchType && matchVille;
    });
  }

  genererEtoiles(note: number): string[] {
    const etoiles = [];
    const noteEntiere = Math.floor(note);
    const decimale = note - noteEntiere;

    for (let i = 0; i < noteEntiere; i++) {
      etoiles.push('full');
    }

    if (decimale >= 0.5) {
      etoiles.push('half');
    }

    while (etoiles.length < 5) {
      etoiles.push('empty');
    }

    return etoiles;
  }

  viderFiltres() {
    this.termRecherche = '';
    this.filtreType = 'tous';
    this.filtreVille = 'toutes';
    this.etablissementsFiltres = [...this.etablissements];
  }
}
