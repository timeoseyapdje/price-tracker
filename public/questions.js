// Banque de questions TOEIC (contenu original, inspiré du format officiel
// sans reproduire de questions protégées par copyright).
//
// Chaque question a la forme :
// {
//   id: identifiant unique,
//   part: 5 | 6 | 7,
//   category: clé de catégorie (voir CATEGORY_LABELS),
//   passage: texte de contexte partagé (ou null),
//   prompt: énoncé / phrase à trou,
//   choices: [4 propositions],
//   answer: index (0-3) de la bonne réponse,
//   explanation: courte explication grammaticale (en français)
// }

const CATEGORY_LABELS = {
  tense: "Temps verbaux",
  conditional: "Conditionnels",
  passive: "Voix passive",
  preposition: "Prépositions",
  relative: "Relatives",
  connector: "Connecteurs logiques",
  phrasal: "Phrasal verbs",
  "vocab-office": "Vocabulaire bureau/réunions",
  "vocab-travel": "Vocabulaire voyage/transport",
  "vocab-finance": "Vocabulaire finance/achats",
  "vocab-hr": "Vocabulaire RH",
  comprehension: "Compréhension écrite",
};

const QUESTIONS = [
  // ---------------------------------------------------------------
  // PART 5 — Grammaire / phrase à trous (44 questions)
  // ---------------------------------------------------------------

  // Temps verbaux
  {
    id: "p5-tense-1",
    part: 5,
    category: "tense",
    passage: null,
    prompt: "By the time the CEO arrives, the sales team ____ the quarterly report already.",
    choices: ["will finish", "will have finished", "finishes", "has finished"],
    answer: 1,
    explanation:
      "On utilise le futur antérieur (will have + participe passé) pour une action qui sera terminée avant un autre événement futur (« by the time... arrives »).",
  },
  {
    id: "p5-tense-2",
    part: 5,
    category: "tense",
    passage: null,
    prompt: "Ms. Alvarez ____ for this company since 2015.",
    choices: ["works", "worked", "has worked", "is working"],
    answer: 2,
    explanation:
      "« Since + date » indique une action commencée dans le passé et qui continue : on emploie le present perfect.",
  },
  {
    id: "p5-tense-3",
    part: 5,
    category: "tense",
    passage: null,
    prompt: "The technicians ____ the server when the power outage occurred.",
    choices: ["upgrade", "upgraded", "were upgrading", "have upgraded"],
    answer: 2,
    explanation:
      "Le past continuous (were upgrading) décrit une action en cours interrompue par un événement ponctuel au passé simple (occurred).",
  },
  {
    id: "p5-tense-4",
    part: 5,
    category: "tense",
    passage: null,
    prompt: "Next quarter, the company ____ its new product line internationally.",
    choices: ["launches", "will launch", "launched", "has launched"],
    answer: 1,
    explanation:
      "« Next quarter » annonce une action future : on utilise le futur simple (will + base verbale).",
  },

  // Conditionnels
  {
    id: "p5-cond-1",
    part: 5,
    category: "conditional",
    passage: null,
    prompt: "If the shipment ____ on time, we would not have missed the deadline.",
    choices: ["arrives", "arrived", "had arrived", "will arrive"],
    answer: 2,
    explanation:
      "Conditionnel de type 3 (regret passé) : if + past perfect, would have + participe passé dans la principale.",
  },
  {
    id: "p5-cond-2",
    part: 5,
    category: "conditional",
    passage: null,
    prompt: "If you ____ the contract carefully, you will notice the revised payment terms.",
    choices: ["read", "will read", "had read", "would read"],
    answer: 0,
    explanation:
      "Conditionnel de type 1 (situation réelle/probable) : if + présent simple, will + base verbale dans la principale.",
  },
  {
    id: "p5-cond-3",
    part: 5,
    category: "conditional",
    passage: null,
    prompt: "Unless the budget ____ approved, the project cannot proceed.",
    choices: ["is", "was", "will be", "had been"],
    answer: 0,
    explanation:
      "« Unless » (= if...not) suit la même règle que le conditionnel de type 1 : présent simple après unless.",
  },
  {
    id: "p5-cond-4",
    part: 5,
    category: "conditional",
    passage: null,
    prompt: "If I were in charge of the negotiation, I ____ a more flexible deadline.",
    choices: ["propose", "will propose", "would propose", "had proposed"],
    answer: 2,
    explanation:
      "Conditionnel de type 2 (situation hypothétique présente) : if + prétérit (were), would + base verbale.",
  },

  // Voix passive
  {
    id: "p5-pass-1",
    part: 5,
    category: "passive",
    passage: null,
    prompt: "The annual report ____ by the finance department every January.",
    choices: ["prepares", "is prepared", "prepared", "has prepare"],
    answer: 1,
    explanation:
      "Voix passive au présent simple (is/are + participe passé) : le rapport « est préparé » par le service, action habituelle.",
  },
  {
    id: "p5-pass-2",
    part: 5,
    category: "passive",
    passage: null,
    prompt: "The new policy ____ to all employees before it takes effect next month.",
    choices: ["will announce", "will be announced", "announces", "announced"],
    answer: 1,
    explanation: "Voix passive au futur : will be + participe passé, la politique « sera annoncée ».",
  },
  {
    id: "p5-pass-3",
    part: 5,
    category: "passive",
    passage: null,
    prompt: "All invoices ____ before the end of the fiscal year.",
    choices: ["must process", "must be processed", "must processing", "must processed"],
    answer: 1,
    explanation: "Modal + voix passive : must be + participe passé.",
  },
  {
    id: "p5-pass-4",
    part: 5,
    category: "passive",
    passage: null,
    prompt: "The merger ____ widely in the business press last week.",
    choices: ["discussed", "was discussed", "discusses", "has discussed"],
    answer: 1,
    explanation:
      "Voix passive au passé simple (was/were + participe passé), indiquée par « last week ».",
  },

  // Prépositions
  {
    id: "p5-prep-1",
    part: 5,
    category: "preposition",
    passage: null,
    prompt: "The meeting has been rescheduled ____ Thursday afternoon.",
    choices: ["in", "on", "at", "for"],
    answer: 1,
    explanation:
      "On utilise « on » avec les jours de la semaine, y compris avec un moment de la journée précisé (on Thursday afternoon).",
  },
  {
    id: "p5-prep-2",
    part: 5,
    category: "preposition",
    passage: null,
    prompt: "The warehouse is located ____ the corner of Fifth Avenue and Main Street.",
    choices: ["in", "on", "at", "to"],
    answer: 2,
    explanation:
      "Expression figée : « at the corner of » pour indiquer un emplacement précis à un croisement.",
  },
  {
    id: "p5-prep-3",
    part: 5,
    category: "preposition",
    passage: null,
    prompt: "The invoice must be paid ____ thirty days of receipt.",
    choices: ["during", "within", "between", "among"],
    answer: 1,
    explanation: "« Within » + durée indique une limite de temps à ne pas dépasser.",
  },
  {
    id: "p5-prep-4",
    part: 5,
    category: "preposition",
    passage: null,
    prompt: "The negotiations have continued ____ several months without a resolution.",
    choices: ["since", "for", "during", "by"],
    answer: 1,
    explanation:
      "« For » + durée exprime la longueur d'une période (« for several months »), alors que « since » s'utilise avec un point de départ précis.",
  },

  // Relatives
  {
    id: "p5-rel-1",
    part: 5,
    category: "relative",
    passage: null,
    prompt:
      "The candidate ____ resume impressed the hiring committee will be interviewed next week.",
    choices: ["who", "whose", "which", "whom"],
    answer: 1,
    explanation:
      "« Whose » est le pronom relatif possessif, utilisé ici pour relier « candidate » et « resume » (le CV du candidat).",
  },
  {
    id: "p5-rel-2",
    part: 5,
    category: "relative",
    passage: null,
    prompt: "The supplier with ____ we have negotiated this contract is based in Germany.",
    choices: ["who", "whom", "which", "whose"],
    answer: 1,
    explanation:
      "Après une préposition (with), on utilise « whom » pour désigner une personne, jamais « who ».",
  },
  {
    id: "p5-rel-3",
    part: 5,
    category: "relative",
    passage: null,
    prompt: "The report, ____ was submitted late, contained several errors.",
    choices: ["that", "which", "who", "whose"],
    answer: 1,
    explanation:
      "Dans une proposition relative non déterminative (entre virgules), on utilise « which » et non « that ».",
  },
  {
    id: "p5-rel-4",
    part: 5,
    category: "relative",
    passage: null,
    prompt: "Employees ____ performance exceeds expectations will receive a bonus.",
    choices: ["who", "whose", "which", "whom"],
    answer: 1,
    explanation:
      "« Whose » relie « employees » et « performance » (la performance de qui appartient aux employés).",
  },

  // Connecteurs logiques
  {
    id: "p5-conn-1",
    part: 5,
    category: "connector",
    passage: null,
    prompt: "The flight was delayed by six hours; ____, several passengers missed their connections.",
    choices: ["however", "therefore", "although", "meanwhile"],
    answer: 1,
    explanation:
      "« Therefore » introduit une conséquence logique : le retard a entraîné la perte des correspondances.",
  },
  {
    id: "p5-conn-2",
    part: 5,
    category: "connector",
    passage: null,
    prompt: "____ the budget cuts, the marketing team managed to launch the campaign successfully.",
    choices: ["Because of", "Despite", "Therefore", "Although"],
    answer: 1,
    explanation:
      "« Despite » + groupe nominal exprime une opposition/concession (contrairement à « although », suivi d'une proposition avec sujet + verbe).",
  },
  {
    id: "p5-conn-3",
    part: 5,
    category: "connector",
    passage: null,
    prompt: "The proposal was well researched; ____, the board rejected it due to cost concerns.",
    choices: ["moreover", "nevertheless", "consequently", "similarly"],
    answer: 1,
    explanation:
      "« Nevertheless » marque un contraste : malgré la qualité de la proposition, elle a été rejetée.",
  },
  {
    id: "p5-conn-4",
    part: 5,
    category: "connector",
    passage: null,
    prompt:
      "____ the manager approved the request, the finance department refused to release the funds.",
    choices: ["Despite", "Although", "Because of", "Therefore"],
    answer: 1,
    explanation:
      "« Although » + sujet + verbe introduit une opposition (contrairement à « despite », suivi d'un groupe nominal).",
  },

  // Phrasal verbs
  {
    id: "p5-phr-1",
    part: 5,
    category: "phrasal",
    passage: null,
    prompt: "The board decided to ____ the merger after reviewing the financial risks.",
    choices: ["call off", "call on", "call up", "call in"],
    answer: 0,
    explanation:
      "« Call off » signifie annuler ; les autres verbes à particule ont un sens différent (call on = solliciter, call up = téléphoner/mobiliser, call in = faire venir).",
  },
  {
    id: "p5-phr-2",
    part: 5,
    category: "phrasal",
    passage: null,
    prompt: "Please ____ the details of the proposal before the client meeting.",
    choices: ["look up", "go over", "come across", "run into"],
    answer: 1,
    explanation:
      "« Go over » signifie examiner/relire attentivement, ce qui convient au contexte de préparation d'une réunion.",
  },
  {
    id: "p5-phr-3",
    part: 5,
    category: "phrasal",
    passage: null,
    prompt: "The new manager will ____ the tasks among the team members.",
    choices: ["divide up", "look into", "put off", "come up"],
    answer: 0,
    explanation: "« Divide up » signifie répartir/diviser, adapté à la répartition de tâches.",
  },
  {
    id: "p5-phr-4",
    part: 5,
    category: "phrasal",
    passage: null,
    prompt: "The company had to ____ production due to a shortage of raw materials.",
    choices: ["scale back", "look forward", "catch up", "hold on"],
    answer: 0,
    explanation: "« Scale back » signifie réduire, ce qui correspond à une baisse de production.",
  },

  // Vocabulaire bureau/réunions
  {
    id: "p5-off-1",
    part: 5,
    category: "vocab-office",
    passage: null,
    prompt: "All staff must ____ the new attendance policy starting Monday.",
    choices: ["comply with", "comply to", "comply for", "comply in"],
    answer: 0,
    explanation: "Le verbe « comply » se construit toujours avec la préposition « with ».",
  },
  {
    id: "p5-off-2",
    part: 5,
    category: "vocab-office",
    passage: null,
    prompt: "The quarterly ____ will be held in the main conference room.",
    choices: ["briefing", "brief", "briefed", "briefly"],
    answer: 0,
    explanation:
      "« Briefing » est le nom qui désigne une réunion d'information ; les autres options ne sont pas des noms adaptés ici.",
  },
  {
    id: "p5-off-3",
    part: 5,
    category: "vocab-office",
    passage: null,
    prompt: "Employees are required to submit their expense ____ by the fifth of each month.",
    choices: ["receipts", "reports", "reimbursements", "invoices"],
    answer: 1,
    explanation: "« Expense report » est l'expression consacrée pour désigner une note de frais.",
  },
  {
    id: "p5-off-4",
    part: 5,
    category: "vocab-office",
    passage: null,
    prompt: "The agenda includes a discussion of the upcoming ____ with the regional offices.",
    choices: ["teleconference", "telecommute", "telegraph", "television"],
    answer: 0,
    explanation:
      "« Teleconference » désigne une réunion à distance, cohérent avec le contexte professionnel.",
  },

  // Vocabulaire voyage/transport
  {
    id: "p5-trav-1",
    part: 5,
    category: "vocab-travel",
    passage: null,
    prompt: "Passengers are advised to arrive at the ____ at least two hours before departure.",
    choices: ["terminal", "terminus", "terminate", "terminally"],
    answer: 0,
    explanation: "« Terminal » désigne l'aérogare où les passagers embarquent.",
  },
  {
    id: "p5-trav-2",
    part: 5,
    category: "vocab-travel",
    passage: null,
    prompt: "The airline offers a full ____ for tickets cancelled within 24 hours.",
    choices: ["refund", "refundable", "refunding", "refunded"],
    answer: 0,
    explanation: "« Refund » est le nom désignant un remboursement.",
  },
  {
    id: "p5-trav-3",
    part: 5,
    category: "vocab-travel",
    passage: null,
    prompt: "Due to heavy traffic, the shuttle bus is running ____ schedule.",
    choices: ["behind", "beyond", "below", "under"],
    answer: 0,
    explanation: "« Behind schedule » est une expression figée signifiant « en retard ».",
  },
  {
    id: "p5-trav-4",
    part: 5,
    category: "vocab-travel",
    passage: null,
    prompt: "Business travelers should keep all ____ in a carry-on bag for easy access.",
    choices: ["itineraries", "itinerant", "itinerancy", "itinerate"],
    answer: 0,
    explanation:
      "« Itinerary » (au pluriel itineraries) désigne le programme de voyage ; c'est le seul nom de la liste.",
  },

  // Vocabulaire finance/achats
  {
    id: "p5-fin-1",
    part: 5,
    category: "vocab-finance",
    passage: null,
    prompt: "The company's ____ grew by fifteen percent compared to last year.",
    choices: ["revenue", "expense", "liability", "discount"],
    answer: 0,
    explanation: "« Revenue » désigne le chiffre d'affaires/les recettes d'une entreprise.",
  },
  {
    id: "p5-fin-2",
    part: 5,
    category: "vocab-finance",
    passage: null,
    prompt: "Investors were concerned about the firm's rising ____ costs.",
    choices: ["operating", "operate", "operation", "operates"],
    answer: 0,
    explanation:
      "« Operating costs » est l'expression figée pour les coûts d'exploitation ; « operating » fonctionne ici comme adjectif.",
  },
  {
    id: "p5-fin-3",
    part: 5,
    category: "vocab-finance",
    passage: null,
    prompt: "The vendor requires a ____ payment before shipping the order.",
    choices: ["down", "downward", "downed", "downing"],
    answer: 0,
    explanation: "« Down payment » est l'expression consacrée pour un acompte.",
  },
  {
    id: "p5-fin-4",
    part: 5,
    category: "vocab-finance",
    passage: null,
    prompt: "The auditors identified several ____ in the company's financial statements.",
    choices: ["discrepancies", "discrepant", "discrepancy", "discrepantly"],
    answer: 0,
    explanation: "Le pluriel « discrepancies » (écarts/anomalies) est requis après « several ».",
  },

  // Vocabulaire RH
  {
    id: "p5-hr-1",
    part: 5,
    category: "vocab-hr",
    passage: null,
    prompt: "New hires must complete an ____ program during their first week.",
    choices: ["orientation", "orient", "oriented", "orienting"],
    answer: 0,
    explanation: "« Orientation program » désigne le programme d'intégration des nouveaux employés.",
  },
  {
    id: "p5-hr-2",
    part: 5,
    category: "vocab-hr",
    passage: null,
    prompt: "The HR department is responsible for processing employee ____ requests.",
    choices: ["leave", "left", "leaving", "leaves"],
    answer: 0,
    explanation:
      "« Leave » (congé) est utilisé ici comme nom invariable dans l'expression « leave request ».",
  },
  {
    id: "p5-hr-3",
    part: 5,
    category: "vocab-hr",
    passage: null,
    prompt: "Candidates who pass the initial screening will be invited for an ____ interview.",
    choices: ["on-site", "on-side", "onsided", "siting"],
    answer: 0,
    explanation:
      "« On-site interview » signifie un entretien effectué sur place, dans les locaux de l'entreprise.",
  },
  {
    id: "p5-hr-4",
    part: 5,
    category: "vocab-hr",
    passage: null,
    prompt:
      "The company offers a competitive benefits ____, including health insurance and retirement plans.",
    choices: ["package", "packaging", "packed", "packet"],
    answer: 0,
    explanation:
      "« Benefits package » est l'expression figée désignant l'ensemble des avantages sociaux.",
  },

  // ---------------------------------------------------------------
  // PART 6 — Texte à trous, 4 passages x 4 questions (16 questions)
  // ---------------------------------------------------------------

  (() => {
    const passage =
      "To: All Staff\nFrom: Office Management\nSubject: Parking Lot Renovation\n\n" +
      "We would like to inform you that the parking lot renovation (1)____ next Monday. " +
      "During the construction period, employees (2)____ to use the temporary lot located behind Building C. " +
      "The renovation is expected to take approximately three weeks, (3)____ weather conditions permit. " +
      "We apologize for any inconvenience this may cause and appreciate your patience. " +
      "If you have any questions, please (4)____ the facilities office directly.";
    return [
      {
        id: "p6-parking-1",
        part: 6,
        category: "tense",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (1) ?",
        choices: ["begins", "will begin", "began", "has begun"],
        answer: 1,
        explanation: "Le futur simple annonce un événement prévu (la rénovation commence lundi prochain).",
      },
      {
        id: "p6-parking-2",
        part: 6,
        category: "passive",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (2) ?",
        choices: ["are asked", "ask", "asked", "will ask"],
        answer: 0,
        explanation: "Voix passive au présent : « employees are asked to... » (on demande aux employés de...).",
      },
      {
        id: "p6-parking-3",
        part: 6,
        category: "connector",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (3) ?",
        choices: ["although", "provided that", "because", "despite"],
        answer: 1,
        explanation:
          "« Provided that » introduit une condition (= à condition que), cohérent avec « weather conditions permit ».",
      },
      {
        id: "p6-parking-4",
        part: 6,
        category: "vocab-office",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (4) ?",
        choices: ["contact", "reach out", "get in touch", "look up"],
        answer: 0,
        explanation:
          "« Contact » se construit directement avec un complément d'objet, sans préposition, contrairement à « reach out to » ou « get in touch with ».",
      },
    ];
  })(),

  (() => {
    const passage =
      "Dear Traveler,\n\nThank you for choosing SkyLine Airways. Please be advised that flight SL204 to Chicago " +
      "(1)____ delayed due to unfavorable weather conditions. Passengers (2)____ wait in the designated lounge area " +
      "until further notice. We understand this delay is inconvenient, (3)____ we are doing everything possible " +
      "to minimize the wait time. Once the new departure time is confirmed, an announcement (4)____ over the terminal speakers.";
    return [
      {
        id: "p6-flight-1",
        part: 6,
        category: "passive",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (1) ?",
        choices: ["is", "was", "has been", "will be"],
        answer: 2,
        explanation:
          "Le present perfect passive (« has been delayed ») indique un état résultant d'une action passée, toujours valable au moment de l'annonce.",
      },
      {
        id: "p6-flight-2",
        part: 6,
        category: "passive",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (2) ?",
        choices: ["are required to", "require", "required", "requiring"],
        answer: 0,
        explanation:
          "Voix passive avec modal implicite : « are required to wait » (on exige des passagers qu'ils attendent).",
      },
      {
        id: "p6-flight-3",
        part: 6,
        category: "connector",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (3) ?",
        choices: ["but", "so", "therefore", "although"],
        answer: 0,
        explanation: "« But » introduit une opposition simple entre deux propositions de même niveau.",
      },
      {
        id: "p6-flight-4",
        part: 6,
        category: "tense",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (4) ?",
        choices: ["makes", "will be made", "made", "is made"],
        answer: 1,
        explanation: "Voix passive au futur : « an announcement will be made » (une annonce sera faite).",
      },
    ];
  })(),

  (() => {
    const passage =
      "To: Procurement Team\nRe: Updated Purchase Order Process\n\n" +
      "Starting next month, all purchase orders over $5,000 (1)____ approval from the finance director before being processed. " +
      "This new procedure (2)____ to reduce unnecessary spending and improve budget tracking. " +
      "Employees (3)____ submit requests without prior approval will see their orders delayed. " +
      "For any questions about the new process, employees should consult the finance department, (4)____ has prepared a detailed guide.";
    return [
      {
        id: "p6-procure-1",
        part: 6,
        category: "tense",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (1) ?",
        choices: ["require", "will require", "required", "has required"],
        answer: 1,
        explanation: "« Starting next month » indique une action future : futur simple « will require ».",
      },
      {
        id: "p6-procure-2",
        part: 6,
        category: "passive",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (2) ?",
        choices: ["is designed", "designs", "designed", "has design"],
        answer: 0,
        explanation: "Voix passive au présent : « is designed to » (est conçu pour).",
      },
      {
        id: "p6-procure-3",
        part: 6,
        category: "relative",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (3) ?",
        choices: ["who", "whom", "which", "whose"],
        answer: 0,
        explanation:
          "« Who » est le pronom relatif sujet utilisé pour désigner des personnes (employees who submit...).",
      },
      {
        id: "p6-procure-4",
        part: 6,
        category: "relative",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (4) ?",
        choices: ["that", "which", "who", "whom"],
        answer: 1,
        explanation:
          "Dans une proposition relative non déterminative (entre virgules) désignant une organisation, on utilise « which ».",
      },
    ];
  })(),

  (() => {
    const passage =
      "Subject: New Employee Wellness Program\n\n" +
      "We are pleased to announce that a new wellness program (1)____ launched next month to support employee well-being. " +
      "The program will include free yoga classes, nutrition workshops, and mental health counseling. " +
      "(2)____ many employees have requested such initiatives for years, we are confident this program will be well received. " +
      "Staff members (3)____ wish to participate should register through the HR portal by the end of this week. " +
      "Spaces are limited, so early registration (4)____ recommended.";
    return [
      {
        id: "p6-wellness-1",
        part: 6,
        category: "passive",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (1) ?",
        choices: ["will be", "will", "is", "was"],
        answer: 0,
        explanation: "Voix passive au futur : « will be launched » (sera lancé).",
      },
      {
        id: "p6-wellness-2",
        part: 6,
        category: "connector",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (2) ?",
        choices: ["Because", "Since", "Although", "Despite"],
        answer: 1,
        explanation:
          "« Since » (= étant donné que) introduit une cause/raison en début de phrase, suivie d'une proposition complète.",
      },
      {
        id: "p6-wellness-3",
        part: 6,
        category: "relative",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (3) ?",
        choices: ["who", "whom", "which", "whose"],
        answer: 0,
        explanation: "« Who » est le pronom relatif sujet pour les personnes (« staff members who wish to... »).",
      },
      {
        id: "p6-wellness-4",
        part: 6,
        category: "vocab-hr",
        passage,
        prompt: "Quel mot convient le mieux pour l'espace (4) ?",
        choices: ["is", "are", "was", "has"],
        answer: 0,
        explanation:
          "« Registration » est un nom singulier indénombrable : accord au singulier avec « is recommended ».",
      },
    ];
  })(),

  // ---------------------------------------------------------------
  // PART 7 — Compréhension de texte courte, 2 passages x 3 (6 questions)
  // ---------------------------------------------------------------

  (() => {
    const passage =
      "From: Sandra Kim, HR Director\nTo: All Employees\nSubject: Update on Remote Work Policy\n\n" +
      "Following a company-wide survey, we are pleased to announce updates to our remote work policy, effective October 1st. " +
      "Employees who have completed at least six months with the company will be eligible to work remotely up to three days per week, " +
      "subject to manager approval. Employees must submit a remote work request through the HR portal at least one week in advance. " +
      "Please note that all remote workdays require employees to remain available during core business hours (10 a.m. to 3 p.m.) " +
      "and to attend any scheduled meetings via video conference. Managers will review requests based on team needs and individual performance. " +
      "We believe this update reflects our commitment to flexibility while maintaining productivity and collaboration across teams.";
    return [
      {
        id: "p7-remote-1",
        part: 7,
        category: "comprehension",
        passage,
        prompt: "Who is eligible for the new remote work policy?",
        choices: [
          "All employees immediately",
          "Employees with at least six months of tenure",
          "Only managers",
          "Employees who work in HR",
        ],
        answer: 1,
        explanation:
          "Le texte précise : « Employees who have completed at least six months with the company will be eligible... »",
      },
      {
        id: "p7-remote-2",
        part: 7,
        category: "comprehension",
        passage,
        prompt: "How far in advance must employees submit a remote work request?",
        choices: ["One day", "One week", "One month", "Three days"],
        answer: 1,
        explanation:
          "Le texte indique : « submit a remote work request... at least one week in advance. »",
      },
      {
        id: "p7-remote-3",
        part: 7,
        category: "comprehension",
        passage,
        prompt: "What is required of employees during remote workdays?",
        choices: [
          "They must work from the office once a week",
          "They must be available during core business hours",
          "They must submit a report daily",
          "They must find their own equipment",
        ],
        answer: 1,
        explanation:
          "Le texte précise : « remain available during core business hours (10 a.m. to 3 p.m.) »",
      },
    ];
  })(),

  (() => {
    const passage =
      "NOTICE TO ALL PASSENGERS\n\n" +
      "Due to scheduled track maintenance, Central Line trains will not stop at Riverside Station between September 10 and September 14. " +
      "During this period, a free shuttle bus will operate between Riverside Station and Oak Street Station every fifteen minutes " +
      "from 6 a.m. to 11 p.m. Passengers traveling to or from Riverside Station should allow an additional 20 minutes for their journey. " +
      "Ticket prices will remain unchanged, and passengers may use their regular tickets or passes on the shuttle bus. " +
      "We apologize for any inconvenience and thank you for your patience during this essential maintenance work.";
    return [
      {
        id: "p7-shuttle-1",
        part: 7,
        category: "comprehension",
        passage,
        prompt: "Why is the shuttle bus service being introduced?",
        choices: [
          "To replace a cancelled train line",
          "Because of scheduled maintenance",
          "Due to a staff strike",
          "Because a new station is opening",
        ],
        answer: 1,
        explanation: "Le texte indique : « Due to scheduled track maintenance... »",
      },
      {
        id: "p7-shuttle-2",
        part: 7,
        category: "comprehension",
        passage,
        prompt: "How often does the shuttle bus run?",
        choices: ["Every 10 minutes", "Every 15 minutes", "Every 30 minutes", "Every hour"],
        answer: 1,
        explanation:
          "Le texte précise : « a free shuttle bus will operate... every fifteen minutes. »",
      },
      {
        id: "p7-shuttle-3",
        part: 7,
        category: "comprehension",
        passage,
        prompt: "What should passengers do regarding travel time?",
        choices: [
          "Arrive exactly on time",
          "Allow an extra 20 minutes",
          "Buy a new ticket",
          "Avoid traveling during this period",
        ],
        answer: 1,
        explanation: "Le texte conseille : « allow an additional 20 minutes for their journey. »",
      },
    ];
  })(),
].flat();
