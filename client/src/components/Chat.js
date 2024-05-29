import React, { useState, useEffect } from 'react';
import './poltergeist.css';
import { FaVolumeUp, FaWifi, FaBatteryFull } from 'react-icons/fa';

const Chat = () => {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [isFirstLetter, setIsFirstLetter] = useState(true);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateCurrentTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };

        updateCurrentTime(); // Update the time immediately
        const intervalId = setInterval(updateCurrentTime, 60000); // Update the time every minute

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, []);

    useEffect(() => {
        setIsFirstLetter(text.length === 0);
    }, [text]);

    const getCompletion = async (inputText) => {
        const response = await fetch('https://poltergeist-server-5tun9.kinsta.app/completion', {
            method: 'POST',
            body: JSON.stringify({ text: inputText }),
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        return data.message.content;
    };

    const sendMessage = async () => {
        if (text.trim() === '') return;

        const newMessage = { type: 'sent', text };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        setText('');

        const responseText = await getCompletion(newMessage.text);
        const responseMessage = { type: 'received', text: responseText };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
    };

    const appendTextToInput = (char) => {
        const newText = isFirstLetter ? char.toUpperCase() : char.toLowerCase();
        setText((prevText) => prevText + newText);
    };

    const handleErase = () => {
        setText((prevText) => prevText.slice(0, -1));
    };

    const handleSpace = () => {
        setText((prevText) => prevText + ' ');
    };

    const openLink = () => {
        window.open('https://calendly.com/ricardoasalmeida22/poltergeist?preview_source=et_card&month=2024-05', '_blank');
    };

    const handleSoundButtonClick = () => {
        const soundMessage = { type: 'received', text: "The sound implementation hasn't been done yet. The composer is still trying to understand the RNBO Javascript API :) " };
        setMessages((prevMessages) => [...prevMessages, soundMessage]);
    };

    return (
        <div className="App">
            <div className="container">
                <div className="header">
                    <div className="headertop">
                        <span className="time">{currentTime}</span>
                        <div className="information">
                            <div className="wi-fi"><FaWifi className="icon-black" /></div>
                            <div className="battery"><FaBatteryFull className="icon-black" /></div>
                        </div>
                    </div>
                    <div className="headerbot">
                        <div className="profilepic"></div>
                        <div className="identificationwpp">
                            <h1>poltergeist</h1>
                            <h2>online</h2>
                        </div>
                    </div>
                </div>
                <div className="chat-window">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.type}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="footer">
                    <div className="talkbar">
                        <div className="typing">
                            <input
                                className="messaging"
                                type="text"
                                placeholder="ask any question about the piece"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') sendMessage();
                                }}
                            />
                            <button className="sendmessage" onClick={sendMessage}></button>
                        </div>
                    </div>
                    <div className="keyboard">
                        <div className="firstrow">
                            {'QWERTYUIOP'.split('').map((char) => (
                                <button
                                    key={char}
                                    className="keybutton"
                                    onClick={() => appendTextToInput(char)}
                                    style={{ textTransform: isFirstLetter ? 'uppercase' : 'lowercase' }}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                        <div className="secondrow">
                            {'ASDFGHJKL'.split('').map((char) => (
                                <button
                                    key={char}
                                    className="keybutton"
                                    onClick={() => appendTextToInput(char)}
                                    style={{ textTransform: isFirstLetter ? 'uppercase' : 'lowercase' }}
                                >
                                    {char}
                                </button>
                            ))}
                        </div>
                        <div className="thirdrow">
                            {'ZXCVBNM?'.split('').map((char) => (
                                <button
                                    key={char}
                                    className="keybutton"
                                    onClick={() => appendTextToInput(char)}
                                    style={{ textTransform: isFirstLetter ? 'uppercase' : 'lowercase' }}
                                >
                                    {char}
                                </button>
                            ))}
                            <button
                                id="erasebutton"
                                className="keybutton"
                                onClick={handleErase}
                                style={{ textTransform: isFirstLetter ? 'uppercase' : 'lowercase' }}
                            >
                                ←
                            </button>
                        </div>
                        <div className="forthrow">
                            <button className="spacebarbutton" onClick={handleSpace}>
                                space
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="buttonsinterface">
                <button className="listen-button" onClick={openLink}>
                    schedule a listening session
                </button>
                <button className="SOUND" onClick={handleSoundButtonClick}>
                    {<FaVolumeUp />}
                </button>
            </div>
        </div>
    );
};

export default Chat;
