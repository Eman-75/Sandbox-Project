// import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
// import { AuthContext } from "./AuthContext";
// import toast from "react-hot-toast";

// export const ChatContext = createContext();
// export const ChatProvider = ({ children }) => {
//     const [messages, setMessages] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [unseenMessages, setUnseenMessages] = useState({});

//     const {socket, axios, authUser} = useContext(AuthContext);

//     const getUsers = useCallback(async () => {
//         try {
//             const {data} = await axios.get("/messages/users");
//             if(data.success){
//                 setUsers(data.users);
//                 setUnseenMessages(data.unseenMessages);
//             } else {
//                 console.error('getUsers returned error', data);
//                 toast.error(data.message || 'Failed to load users');
//             }
//         } catch (error) {
//             console.error('getUsers exception', error.response || error);
//             toast.error(error.response?.data?.message || error.message || 'Failed to load users');
//         }
//     }, [axios]);

//     // function to get messages for selected user
//     const getMessages = useCallback(async (userId)=>{
//         try{
//             // route includes "users" segment per server routing
//             const {data} = await axios.get(`/api/messages/users/${userId}`);
//             if(data.success){
//                 setMessages(data.messages);
//             } else {
//                 // show server error message if present
//                 toast.error(data.message || 'Failed to load messages');
//             }
//         } catch (error) {
//             console.error('getMessages error', error.response || error);
//             toast.error(error.response?.data?.message || error.message || 'Fetch messages failed');
//         }
//     }, [axios]);

//     const sendMessage = async (messageData)=>{
//         try {
//             const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
//             if(data.success){
//                 // server may return newMessage or message depending on version
//                 const msg = data.newMessage || data.message;
//                 if (msg) {
//                     // ensure senderId exists so alignment works immediately
//                     if (!msg.senderId && authUser?._id) msg.senderId = authUser._id;
//                     setMessages((prevMessages) => [...prevMessages, msg]);
//                 }
//             }
//             else{
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error('sendMessage error', error.response || error);
//             toast.error(error.response?.data?.message || error.message || 'Send failed');
//         }
//     }

//     // Listen for new messages from socket
//     const subscribeToMessages = async () => {
//         if(!socket) return;
//         socket.on("newMessage", (newMessage)=>{
//             if(selectedUser && newMessage.senderId === selectedUser._id){
//                 newMessage.seen = true;
//                 setMessages((prevMessages) => [...prevMessages, newMessage]);
//                 // Mark message as seen
//                 axios.put(`/api/messages/users/mark/${newMessage._id}`);
//             }else{
//                 setUnseenMessages((prev) => ({
//                     ...prev,
//                     [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
//                 }));
//             }
//         });
//         socket.on('messagesSeen', (ids) => {
//             setMessages((prev) =>
//                 prev.map(m => (ids.includes(m._id) ? { ...m, seen: true } : m))
//             );
//         });
//     }

//     // function to unsubscribe from messages
//     const unsubscribeFromMessages = () => {
//         if(socket) socket.off("newMessage");
//     }

//     useEffect(() => {
//         subscribeToMessages();
//         return () => {
//             unsubscribeFromMessages();
//         }
//     }, [socket, selectedUser]);

//     const value = {
//         messages,
//         setMessages,
//         users,
//         selectedUser,
//         unseenMessages,
//         setSelectedUser,
//         getUsers,
//         getMessages,
//         sendMessage,
//         setUnseenMessages,
//     }

//     return (
//     <ChatContext.Provider value={value}>
//         {children}
//     </ChatContext.Provider>
//     )
// }


















import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [assistantMessages, setAssistantMessages] = useState([]);
    const [assistantLoading, setAssistantLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios, authUser} = useContext(AuthContext);

    const buildLocalAssistantFallback = (prompt = '') => {
        return `SandBox AI fallback mode is active.

I can still help without external AI keys.
- Request: ${prompt || 'No prompt provided'}
- I can draft proposal text, improve wording, and highlight risks.
- I can also analyze uploaded PDF/PPT/PPTX using structured fallback logic.

If you configure GROQ_API_KEY on the server and restart backend, responses become fully model-generated.`;
    };

    const buildLocalDocumentFallback = ({ fileName, description }) => {
        return `Enhancements
- Clarify the problem statement in one line at the start.
- Add measurable traction and concrete proof points.
- Tighten funding ask with use-of-funds breakdown.
- Keep each section/slide focused on one message.

Mistakes / Risks
- Generic claims without numbers reduce trust.
- Missing GTM details make execution look weak.
- Financial assumptions may be unvalidated.
- Visual inconsistency can hurt perceived quality.

Client Message
I reviewed "${fileName}" and identified specific improvements to strengthen clarity, credibility, and investor/client impact. I also highlighted key risks to fix before final submission.

Context considered: ${description || 'No extra context provided.'}`;
    };

    const postWithRouteFallback = async (paths, body, config) => {
        let lastError = null;
        for (const path of paths) {
            try {
                const response = await axios.post(path, body, config);
                return response;
            } catch (error) {
                lastError = error;
                if (error?.response?.status !== 404) {
                    throw error;
                }
            }
        }
        throw lastError;
    };

    const getUsers = useCallback(async () => {
        try {
            const {data} = await axios.get("/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            } else {
                console.error('getUsers returned error', data);
                toast.error(data.message || 'Failed to load users');
            }
        } catch (error) {
            console.error('getUsers exception', error.response || error);
            toast.error(error.response?.data?.message || error.message || 'Failed to load users');
        }
    }, [axios]);

    // function to get messages for selected user
    const getMessages = useCallback(async (userId)=>{
        try{
            // route includes "users" segment per server routing
            const {data} = await axios.get(`/messages/users/${userId}`);
            if(data.success){
                setMessages(data.messages);
            } else {
                // show server error message if present
                toast.error(data.message || 'Failed to load messages');
            }
        } catch (error) {
            console.error('getMessages error', error.response || error);
            toast.error(error.response?.data?.message || error.message || 'Fetch messages failed');
        }
    }, [axios]);

    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                const msg = data.newMessage || data.message;
                if (msg) {
                    if (!msg.senderId && authUser?._id) msg.senderId = authUser._id;
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            console.error('sendMessage error', error.response || error);
            toast.error(error.response?.data?.message || error.message || 'Send failed');
        }
    }

    const sendProposal = async (proposalData) => {
        try {
            const { data } = await axios.post(`/messages/send-proposal/${selectedUser._id}`, proposalData);
            if (data.success) {
                const msg = data.newMessage || data.message;
                if (msg) {
                    if (!msg.senderId && authUser?._id) msg.senderId = authUser._id;
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }
                toast.success('Proposal sent successfully');
                return { success: true, proposal: data.proposal };
            }

            toast.error(data.message || 'Failed to send proposal');
            return { success: false };
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Proposal send failed');
            return { success: false };
        }
    };

    const sendDocumentReview = async ({ file, description }) => {
        if (!selectedUser?._id) {
            toast.error('Please select a chat first');
            return { success: false };
        }

        if (!file) {
            toast.error('Please upload a document');
            return { success: false };
        }

        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('description', description || '');

            const { data } = await postWithRouteFallback(
                [`/messages/send-document-review/${selectedUser._id}`, `/message/send-document-review/${selectedUser._id}`],
                formData
            );

            if (data.success) {
                const msg = data.newMessage || data.message;
                if (msg) {
                    if (!msg.senderId && authUser?._id) msg.senderId = authUser._id;
                    setMessages((prevMessages) => [...prevMessages, msg]);
                }
                toast.success('AI document review sent');
                return { success: true, review: data.review };
            }

            toast.error(data.message || 'Failed to send document review');
            return { success: false };
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Document review failed');
            return { success: false };
        }
    };

    const askAssistant = async (prompt) => {
        const nextUserMessage = { role: 'user', content: prompt };
        const nextHistory = [...assistantMessages, nextUserMessage];
        setAssistantMessages(nextHistory);
        setAssistantLoading(true);

        try {
            const { data } = await postWithRouteFallback(['/messages/assistant', '/message/assistant'], {
                prompt,
                history: assistantMessages,
            });

            if (data.success) {
                setAssistantMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
                return { success: true, reply: data.reply };
            }
            if ((data.message || '').toLowerCase().includes('groq_api_key is missing')) {
                const fallbackReply = buildLocalAssistantFallback(prompt);
                setAssistantMessages((prev) => [...prev, { role: 'assistant', content: fallbackReply }]);
                return { success: true, reply: fallbackReply };
            }
            toast.error(data.message || 'Assistant failed');
        } catch (error) {
            const backendMessage = error.response?.data?.message || '';
            if (backendMessage.toLowerCase().includes('groq_api_key is missing') || error.response?.status === 404) {
                const fallbackReply = buildLocalAssistantFallback(prompt);
                setAssistantMessages((prev) => [...prev, { role: 'assistant', content: fallbackReply }]);
                return { success: true, reply: fallbackReply };
            }
            toast.error(backendMessage || error.message || 'Assistant failed');
        } finally {
            setAssistantLoading(false);
        }

        setAssistantMessages((prev) => prev.slice(0, -1));
        return { success: false };
    };

    const askAssistantWithDocument = async ({ file, description }) => {
        if (!file) {
            toast.error('Please upload a document');
            return { success: false };
        }

        const nextUserMessage = {
            role: 'user',
            content: `Document uploaded: ${file.name}${description ? `\nContext: ${description}` : ''}`,
        };
        setAssistantMessages((prev) => [...prev, nextUserMessage]);
        setAssistantLoading(true);

        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('description', description || '');

            const { data } = await postWithRouteFallback(
                ['/messages/assistant-document', '/message/assistant-document'],
                formData
            );
            if (data.success) {
                setAssistantMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
                return { success: true, reply: data.reply };
            }

            toast.error(data.message || 'Document review failed');
        } catch (error) {
            if (error.response?.status === 404 || (error.response?.data?.message || '').toLowerCase().includes('groq_api_key is missing')) {
                const fallbackReply = buildLocalDocumentFallback({
                    fileName: file?.name || 'document',
                    description,
                });
                setAssistantMessages((prev) => [...prev, { role: 'assistant', content: fallbackReply }]);
                return { success: true, reply: fallbackReply };
            }
            toast.error(error.response?.data?.message || error.message || 'Document review failed');
        } finally {
            setAssistantLoading(false);
        }

        return { success: false };
    };

    // Listen for new messages from socket
    const subscribeToMessages = async () => {
        if(!socket) return;
        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && String(newMessage.senderId) === String(selectedUser._id)){
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                // Mark message as seen
                axios.put(`/messages/users/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1
                }));
            }
        });
        socket.on('messagesSeen', (ids) => {
            setMessages((prev) =>
                prev.map(m => (ids.includes(m._id) ? { ...m, seen: true } : m))
            );
        });
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket) {
            socket.off("newMessage");
            socket.off("messagesSeen");
        }
    }

    useEffect(() => {
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        }
    }, [socket, selectedUser]);

    const value = {
        messages,
        setMessages,
        assistantMessages,
        setAssistantMessages,
        assistantLoading,
        users,
        selectedUser,
        unseenMessages,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
        sendProposal,
        sendDocumentReview,
        askAssistant,
        askAssistantWithDocument,
        setUnseenMessages,
    }

    return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
    )
}