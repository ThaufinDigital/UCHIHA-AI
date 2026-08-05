const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Fungsi untuk merender pesan ke layar
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('avatar');
    // Ikon untuk User dan AI
    avatarDiv.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    contentDiv.textContent = text;

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);

    // Otomatis scroll ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Menampilkan indikator "AI sedang mengetik..."
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'ai-message');
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="avatar"><i class="fas fa-robot"></i></div>
        <div class="content typing-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Menghapus indikator mengetik
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Logika saat tombol kirim ditekan (Sudah Terhubung ke Backend)
async function handleSend() {
    const text = userInput.value.trim();
    if (text === '') return; // Jangan kirim pesan kosong

    // 1. Tampilkan pesan user di layar
    addMessage(text, 'user');
    userInput.value = ''; // Kosongkan kolom ketik

    // 2. Tampilkan efek AI sedang memikirkan jawaban
    showTypingIndicator();

    try {
        // 3. Kirim pesan ke Backend (Server)
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        // 4. Hapus animasi mengetik dan tampilkan balasan asli dari AI
        removeTypingIndicator();
        
        if (data.reply) {
            addMessage(data.reply, 'ai');
        } else {
            addMessage("Maaf, saya tidak bisa merespons saat ini.", 'ai');
        }
    } catch (error) {
        removeTypingIndicator();
        addMessage("Waduh, koneksi ke server backend terputus. Pastikan server.js sudah berjalan ya!", 'ai');
    }
}

// Event listener untuk tombol dan tombol 'Enter' pada keyboard
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSend();
    }
});