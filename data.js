const STORAGE_KEY = 'philosophyOfMindTrackerPWA';
const readingListData = [
  {
    "id": "montero-vsi",
    "order": 1,
    "title": "Philosophy of Mind: A Very Short Introduction",
    "author": "Barbara Gail Montero",
    "category": "Foundation",
    "description": "A fast, approachable orientation to the field. Good for dualism, physicalism, and qualia.",
    "summary": "A compact map of the field. Montero introduces the central dispute over whether the mind is ultimately physical, explains why consciousness creates special difficulties for materialist theories, and walks through classic problems such as qualia, personal identity, and mental causation. It is useful as a framework-builder because it helps you keep the major views and problems straight."
  },
  {
    "id": "minds-i",
    "order": 2,
    "title": "The Mind's I",
    "author": "Douglas Hofstadter & Daniel Dennett",
    "category": "Foundation",
    "description": "A playful but serious anthology on selfhood, AI, identity, and consciousness.",
    "summary": "This anthology uses stories, thought experiments, and essays to pressure ordinary assumptions about the self. A recurring idea is that identity may be better understood as a pattern than as a hidden inner substance. It is especially good for seeing how questions about consciousness connect to computation, artificial intelligence, personal identity, and the possibility that minds could be realized in different physical systems."
  },
  {
    "id": "consciousness-explained",
    "order": 3,
    "title": "Consciousness Explained",
    "author": "Daniel Dennett",
    "category": "Foundation",
    "description": "A major defense of a non-mysterious account of consciousness, challenging the idea of an inner theater.",
    "summary": "Dennett argues against the idea that consciousness happens in a single inner place where everything comes together for a spectator-self. His attack on the Cartesian theater replaces that picture with distributed, parallel processes. The lasting value of the book is its attempt to explain consciousness without treating it as a separate, irreducible glow over brain activity."
  },
  {
    "id": "mind-brief-intro",
    "order": 4,
    "title": "Mind: A Brief Introduction",
    "author": "John Searle",
    "category": "Foundation",
    "description": "A clear overview of core philosophy of mind positions and Searle's own biological naturalism.",
    "summary": "Searle surveys the main positions in philosophy of mind while arguing that consciousness is both real and irreducible, yet still fully part of nature. He rejects both straightforward dualism and purely computational theories of mind. The book is most helpful as an orientation to his biological naturalism: minds are caused by brains, but first-person consciousness cannot be captured by syntax alone."
  },
  {
    "id": "rediscovery-mind",
    "order": 5,
    "title": "The Rediscovery of the Mind",
    "author": "John Searle",
    "category": "Core Debates",
    "description": "A sharper critique of computational views of mind, including the broader implications of Searle's position.",
    "summary": "Here Searle pushes harder against what he sees as mistakes in mainstream cognitive science. His central point is that consciousness and intentionality are not optional surface features that can be ignored or redefined away. He argues that theories reducing the mind to information processing or formal symbol manipulation leave out the very phenomena they are meant to explain."
  },
  {
    "id": "metaphysics-of-mind",
    "order": 6,
    "title": "Philosophy of Mind / Metaphysics of Mind",
    "author": "Jaegwon Kim",
    "category": "Core Debates",
    "description": "A more rigorous treatment of physicalism, supervenience, and the mental causation problem.",
    "summary": "Kim focuses on one of the hardest problems for nonreductive physicalism: if the physical world is causally closed, what causal work is left for mental properties to do? He develops the issues around supervenience, reduction, and mental causation with unusual clarity. The enduring lesson is that many attractive middle positions face pressure either toward reduction or toward a kind of causal redundancy."
  },
  {
    "id": "mind-and-world",
    "order": 7,
    "title": "Mind and World",
    "author": "John McDowell",
    "category": "Core Debates",
    "description": "A deeper and more difficult work on perception, experience, and how mind relates to reality.",
    "summary": "McDowell argues against pictures of the mind that either detach thought from the world or reduce experience to mere impacts from outside. He wants to show how experience can rationally constrain belief without becoming either spooky or merely causal. A key theme is that human mindedness is already embedded in a shared conceptual world rather than trapped inside the head trying to bridge an external gap."
  },
  {
    "id": "being-you",
    "order": 8,
    "title": "Being You",
    "author": "Anil Seth",
    "category": "Contemporary",
    "description": "A modern bridge between neuroscience and philosophy, especially on consciousness and selfhood.",
    "summary": "Seth presents consciousness as something the brain actively constructs rather than passively receives. A major theme is predictive processing: perception is shaped by the brain's attempts to predict the causes of sensory input. He also argues that the self is not one single thing but a family of controlled constructions tied to the living body, making the book especially good for connecting neuroscience and phenomenology."
  },
  {
    "id": "surfing-uncertainty",
    "order": 9,
    "title": "Surfing Uncertainty",
    "author": "Andy Clark",
    "category": "Contemporary",
    "description": "An influential introduction to predictive processing and the brain as a prediction machine.",
    "summary": "Clark develops the idea that the brain is fundamentally a prediction engine. On this view, perception is not built from raw input alone, but from attempts to minimize error between top-down expectations and incoming signals. The philosophical payoff is large because it reshapes how you think about perception, action, attention, embodiment, and the mind's active role in world-involvement."
  },
  {
    "id": "strange-loop",
    "order": 10,
    "title": "I Am a Strange Loop",
    "author": "Douglas Hofstadter",
    "category": "Contemporary",
    "description": "A rich exploration of the self, recursion, identity, and consciousness.",
    "summary": "Hofstadter argues that the self is a self-referential pattern that emerges in sufficiently rich representational systems. The strange loop is his way of explaining how an I can arise from matter without requiring a separate mental substance. The book is memorable because it treats personhood as an organized recursive structure rather than as a hidden inner essence."
  },
  {
    "id": "conscious",
    "order": 11,
    "title": "Conscious",
    "author": "Annaka Harris",
    "category": "Contemporary",
    "description": "A short, provocative read that opens the door to panpsychism and other nonstandard views.",
    "summary": "Harris uses the difficulty of explaining consciousness to reopen possibilities that many philosophers dismiss too quickly. She does not offer a fully worked-out theory so much as a disciplined invitation to keep more possibilities live, including panpsychism and views that separate consciousness from familiar assumptions about intelligence or language. It is useful as a reminder that our usual categories may be too narrow."
  },
  {
    "id": "chalmers-anthology",
    "order": 12,
    "title": "Philosophy of Mind: Classical and Contemporary Readings",
    "author": "Edited by David Chalmers",
    "category": "Anthology",
    "description": "A sourcebook for reading the major arguments and original texts in one place.",
    "summary": "This anthology is less a single argument than a map of the field through primary sources. Its value lies in allowing direct comparison: dualism against physicalism, functionalism against biological naturalism, skepticism about qualia against arguments that seem to preserve them. Over time it becomes a reference tool that helps you remember who argued for what and where the fault lines of the debate lie."
  },
  {
    "id": "nagel-bat",
    "order": 13,
    "title": "What Is It Like to Be a Bat?",
    "author": "Thomas Nagel",
    "category": "Papers",
    "description": "Classic paper on subjectivity and the challenge of objective accounts of consciousness.",
    "summary": "Nagel's core claim is that conscious experience has an essentially subjective character. Even a perfect objective science of a bat's physiology and behavior seems unable to tell us what it is like for the bat from the inside. The paper remains central because it sharpens the thought that first-person consciousness may resist complete capture by third-person description."
  },
  {
    "id": "jackson-qualia",
    "order": 14,
    "title": "Epiphenomenal Qualia",
    "author": "Frank Jackson",
    "category": "Papers",
    "description": "The famous knowledge argument and Mary thought experiment.",
    "summary": "Jackson argues that a scientist who knows every physical fact about color vision while living in a black-and-white environment would still learn something new when she first sees color. That is meant to show that complete physical knowledge leaves something out: the qualitative character of experience. Even though Jackson later revised his view, the argument remains a landmark challenge to physicalism."
  },
  {
    "id": "searle-programs",
    "order": 15,
    "title": "Minds, Brains, and Programs",
    "author": "John Searle",
    "category": "Papers",
    "description": "The original Chinese Room paper and a key attack on strong AI.",
    "summary": "Searle argues that following formal rules for symbol manipulation is not enough for genuine understanding. The Chinese Room thought experiment is designed to show that syntax alone does not generate semantics, even if outward behavior appears intelligent. The enduring force of the paper lies in its challenge to the claim that the right program, just by running, literally constitutes a mind."
  }
];
