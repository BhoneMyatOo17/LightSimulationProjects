const ticket = document.getElementById('ticket');

    ticket.addEventListener('mousemove', (e) => {
      const rect = ticket.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;

      const rotY = (px - 50) / 50 * 8;
      const rotX = (py - 50) / 50 * -8;
      ticket.style.setProperty('--rot-x', rotX + 'deg');
      ticket.style.setProperty('--rot-y', rotY + 'deg');

      ticket.style.setProperty('--band-x', px + '%');
      ticket.style.setProperty('--band-y', py + '%');

      // FIX 1: only reveal the overlay while actively hovering
      ticket.classList.add('is-active');
    });

    ticket.addEventListener('mouseleave', () => {
      ticket.style.setProperty('--band-x', '-60%');
      ticket.style.setProperty('--band-y', '-60%');
      ticket.style.setProperty('--rot-x', '0deg');
      ticket.style.setProperty('--rot-y', '0deg');

      ticket.classList.remove('is-active');
    });