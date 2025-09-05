// Mock OpenAI service for demo purposes
// In production, this would make actual API calls to OpenAI

const mockContent = {
  rights: {
    english: `YOUR CONSTITUTIONAL RIGHTS:

1. RIGHT TO REMAIN SILENT
You have the absolute right to remain silent. You are not required to answer questions beyond providing identification when legally required.

2. RIGHT TO REFUSE SEARCHES
You can refuse consent to search your person, belongings, car, or home unless they have a warrant or probable cause.

3. RIGHT TO LEAVE
If you are not under arrest, you have the right to calmly leave. Ask: "Am I free to go?"

4. RIGHT TO AN ATTORNEY
You have the right to speak with an attorney before answering any questions.

5. RIGHT TO RECORD
In most states, you have the right to record police interactions in public spaces.

Remember: Exercise these rights calmly and respectfully. Do not resist physically, even if you believe your rights are being violated.`,

    spanish: `SUS DERECHOS CONSTITUCIONALES:

1. DERECHO A PERMANECER CALLADO
Tiene el derecho absoluto de permanecer callado. No está obligado a responder preguntas más allá de proporcionar identificación cuando sea legalmente requerido.

2. DERECHO A RECHAZAR REGISTROS
Puede rechazar el consentimiento para registrar su persona, pertenencias, automóvil o hogar a menos que tengan una orden judicial o causa probable.

3. DERECHO A IRSE
Si no está bajo arresto, tiene derecho a irse con calma. Pregunte: "¿Soy libre de irme?"

4. DERECHO A UN ABOGADO
Tiene derecho a hablar con un abogado antes de responder cualquier pregunta.

5. DERECHO A GRABAR
En la mayoría de los estados, tiene derecho a grabar interacciones policiales en espacios públicos.

Recuerde: Ejerza estos derechos con calma y respeto. No se resista físicamente, incluso si cree que sus derechos están siendo violados.`
  },

  scripts: {
    english: `HELPFUL PHRASES TO REMEMBER:

IDENTIFICATION REQUESTS:
"I will provide my identification as required by law."

QUESTIONING:
"I am exercising my right to remain silent. I would like to speak with an attorney."

SEARCH REQUESTS:
"I do not consent to any searches. I am exercising my constitutional rights."

DETENTION QUESTIONS:
"Am I free to leave?" / "Am I being detained or arrested?"

STAYING CALM:
"I am not resisting. I am exercising my constitutional rights."

RECORDING:
"I am recording this interaction for my safety and yours."

Remember: Speak clearly, remain calm, and keep your hands visible at all times.`,

    spanish: `FRASES ÚTILES PARA RECORDAR:

SOLICITUDES DE IDENTIFICACIÓN:
"Proporcionaré mi identificación según lo requiera la ley."

INTERROGATORIO:
"Estoy ejerciendo mi derecho a permanecer callado. Me gustaría hablar con un abogado."

SOLICITUDES DE REGISTRO:
"No consiento a ningún registro. Estoy ejerciendo mis derechos constitucionales."

PREGUNTAS DE DETENCIÓN:
"¿Soy libre de irme?" / "¿Estoy siendo detenido o arrestado?"

MANTENER LA CALMA:
"No me estoy resistiendo. Estoy ejerciendo mis derechos constitucionales."

GRABACIÓN:
"Estoy grabando esta interacción por mi seguridad y la suya."

Recuerde: Hable claramente, mantenga la calma y mantenga las manos visibles en todo momento.`
  },

  mistakes: {
    english: `COMMON MISTAKES TO AVOID:

1. TALKING TOO MUCH
• Don't explain your situation or try to convince officers of your innocence
• Limit responses to required identification only

2. CONSENTING TO SEARCHES
• Never say "I guess it's okay" or give unclear consent
• Clearly state: "I do not consent to searches"

3. MAKING SUDDEN MOVEMENTS
• Keep your hands visible at all times
• Move slowly and announce your actions

4. ARGUING OR BECOMING HOSTILE
• Remain calm even if you feel your rights are violated
• Save arguments for court, not the street

5. LYING OR PROVIDING FALSE INFORMATION
• If you choose to speak, be truthful
• It's better to remain silent than to lie

6. INTERFERING WITH THEIR WORK
• Don't physically interfere with arrests of others
• You can observe and record from a reasonable distance

7. ASSUMING YOU KNOW THE LAW
• Laws vary by state and situation
• When in doubt, exercise your right to remain silent`,

    spanish: `ERRORES COMUNES QUE EVITAR:

1. HABLAR DEMASIADO
• No explique su situación o trate de convencer a los oficiales de su inocencia
• Limite las respuestas solo a la identificación requerida

2. CONSENTIR A REGISTROS
• Nunca diga "supongo que está bien" o dé consentimiento poco claro
• Declare claramente: "No consiento a registros"

3. HACER MOVIMIENTOS BRUSCOS
• Mantenga las manos visibles en todo momento
• Muévase lentamente y anuncie sus acciones

4. DISCUTIR O VOLVERSE HOSTIL
• Mantenga la calma incluso si siente que sus derechos están siendo violados
• Guarde los argumentos para la corte, no para la calle

5. MENTIR O PROPORCIONAR INFORMACIÓN FALSA
• Si elige hablar, sea veraz
• Es mejor permanecer callado que mentir

6. INTERFERIR CON SU TRABAJO
• No interfiera físicamente con arrestos de otros
• Puede observar y grabar desde una distancia razonable

7. ASUMIR QUE CONOCE LA LEY
• Las leyes varían por estado y situación
• Cuando tenga dudas, ejerza su derecho a permanecer callado`
  }
}

export const generateRightsContent = async (state, language = 'english') => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // In production, this would make an actual OpenAI API call
  // const openai = new OpenAI({
  //   apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  //   baseURL: "https://openrouter.ai/api/v1",
  //   dangerouslyAllowBrowser: true,
  // })

  // const response = await openai.chat.completions.create({
  //   model: "google/gemini-2.0-flash-001",
  //   messages: [
  //     {
  //       role: "system",
  //       content: `You are a legal rights expert. Provide accurate, state-specific legal information for ${state} in ${language}.`
  //     },
  //     {
  //       role: "user", 
  //       content: `Generate comprehensive legal rights information for police interactions in ${state}.`
  //     }
  //   ]
  // })

  // Return mock content for demo
  return {
    rights: mockContent.rights[language],
    scripts: mockContent.scripts[language], 
    mistakes: mockContent.mistakes[language]
  }
}