document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const puppyName = params.get('puppy');
    const totalPrice = params.get('total');
    let puppyImg = params.get('image'); 

    // Elements
    const resImg = document.getElementById('res-puppy-img');
    const resNameInput = document.getElementById('res-puppy-name');
    const notePuppyName = document.getElementById('note-puppy-name');
    const buyerInput = document.getElementById('buyer-name');
    const noteUserName = document.getElementById('note-user-name');

    // 1. Image Fallback Logic
    if (!puppyImg && puppyName) {
        try {
            const response = await fetch('dogs.json'); //
            const dogs = await response.json();
            const foundDog = dogs.find(d => d.name === puppyName);
            if (foundDog) puppyImg = foundDog.images[0];
        } catch (e) { console.error("JSON fetch failed", e); }
    }

    // 2. Populate Fields
    if (puppyImg) resImg.src = decodeURIComponent(puppyImg);
    if (puppyName) {
        resNameInput.value = puppyName;
        notePuppyName.innerText = puppyName;
    }
    if (totalPrice) {
        document.getElementById('res-total-price').value = totalPrice;
        const priceNum = parseInt(totalPrice.replace(/[^0-9]/g, ''));
        document.getElementById('res-balance').value = `$${(priceNum - 500).toLocaleString()}`;
    }

    // 3. Live Name Update
    buyerInput.addEventListener('input', (e) => {
        noteUserName.innerText = e.target.value || "__________";
    });

    // 4. Signature Setup
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    let drawing = false;
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 2;

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        return { x, y };
    };

    canvas.addEventListener('mousedown', () => { drawing = true; ctx.beginPath(); });
    canvas.addEventListener('mousemove', (e) => {
        if (!drawing) return;
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    });
    window.addEventListener('mouseup', () => {
        drawing = false;
        document.getElementById('signature-input').value = canvas.toDataURL();
    });

    document.getElementById('clear-sig').onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 5. PDF Generation
    document.getElementById('download-pdf').onclick = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("RESERVATION AGREEMENT", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(`Buyer: ${buyerInput.value}`, 20, 40);
        doc.text(`Puppy: ${puppyName}`, 20, 50);
        doc.text(`Balance Due: ${document.getElementById('res-balance').value}`, 20, 60);
        
        const sig = canvas.toDataURL("image/png");
        doc.addImage(sig, 'PNG', 20, 80, 50, 20);
        doc.save(`${puppyName}_Agreement.pdf`);
    };
});