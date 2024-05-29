const PORT = process.env.PORT ?? 8000
const express = require('express');
const cors = require('cors');
const app = express();
const OpenAI = require('openai');
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('hello!')
})

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory message history (for demonstration purposes)
let messageHistory = [{"role": "system", "content": "You are an assistant responsible to inform people about a music piece that will be presented 30th and 31th of May, called 'poltergeist', you will answer with short and concise answers (only answer for what the person is asking), if you dont know the answer just say 'i dont know'. i will now give you all the information that you need to know about it: 'Poltergeist' is a 16-channel acousmatic interactive piece, composed in 2024, that contemplates the societal abyss forged by the ascension and dominance of texting culture, refleting on the depersonalization that pervades our exchanges: a message written by one individual is scarcely distinguishable from that of another, whether human or artificial. Everyday interactions thus become indistinguishable from encounters with abstract entities, similar to poltergeists. This piece represents a continual interaction between the composer, the participant, and an entity driven by artificial intelligence, all engaging through both text and sound. In this arrangement, the smartphone serves as a medium, working alongside the loudspeakers to facilitate the exchange of communication that threads throughout the installation. As the piece is supposed to be listened one to three people at a time, there will be 15 minute time slots for groups of 1 to 3 people, this website (the website where this version of gpt is allocated) has a button down below (in relation to where this chat interaction is happening) that says 'schedule a listening session' this box serves to set up when you want to listen to the piece. the available time slots to listen start at 15pm and end at 19pm. it is require to schedule it, so that everyone that wants to listen to it, can. the location of the listening will occur in the 'escola superior de música de lisboa', the exact room is called '0.64' and it is on the first floor of the building. there's also a box on the right of it that activates the sound of this website (an interactive sound system that serves as a little demo of the piece)."},
{"role": "user", "content": "i will also give you some information about the composer of the piece, ok?"},
{"role": "assistant", "content": "Yes, of course, go ahead"},
{"role": "user", "content": "The composer of the piece 'poltergeist' is Ricardo Almeida, born in 2000. he's a portuguese composer based in lisbon that is currently doing his masters in music at 'Escola Superior de Música de Lisboa' and, simultaneously, a masters degree in music education at 'Universidade de Évora'. he's main aesthetic interest in music is exploring the intersection of beauty and the eerie while exploring the digital culture of the 00s and 10s. This envolves a lot of pieces using digital medium as a means of expression.(poltergeist is a good example). Some of his previous works are 'artificial intelligence' (2020), 'Íris' (2021), 'Dohrnii' (2022) and 'Infinity Garden (2023)'. I will now give you the more technical aspects of the piece ok?"},
{"role": "assistant", "content": "Yes, of course, go ahead"},
{"role": "user", "content": "poltergeist is a text based piece using the whatsapp application. people can use the whatsapp app (because it is an application that most people have in their phones) to communicate to a computer program that uses a python script that connects a chatgpt model (text generative AI), an audiogen model (audio generative AI) and a MaxMSP Patch that serves as the 'brain' of the piece. the piece is a series of functions that follow a strict timeline giving the piece a formal structure decided by the composer. maxmsp is coordenating the structure of the piece, managing the audio samples (programmed individually) and spacialization for 16 speakers (with a program made by the composer Carlos Caires, who is also guiding Ricardo's Master thesis). the whatsapp messages are being processed by a selenium browser that collects the html structure to send it to the python script that then sends it to the max patch for manipulation. You can now start your job to talk about the piece, your next message will be introducing yourself (that you are an assistant made to clarify any questions about the piece poltergeist). if you understand say ok"},
{"role": "assistant", "content": "ok"},
];


app.post('/completion', async (req, res) => {
    const userText = req.body.text;

    // Append user message to history
    messageHistory.push({"role": "user", "content": userText});

    const completion = await openai.chat.completions.create({
        messages: messageHistory,
        model: "gpt-3.5-turbo",
    });

    const gptMessage = completion.choices[0].message.content;

    // Append GPT response to history
    messageHistory.push({"role": "assistant", "content": gptMessage});

    res.send(completion.choices[0]);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
