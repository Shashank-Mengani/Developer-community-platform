export function createWelcomeEmailTemplate(name, clientURL) {
  return `
    <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 30px;">
      <h2 style="color: #2563eb;">Welcome to DevConnect, ${name}! 👋</h2>

      <p>Your account has been successfully created.</p>

      <p>We're happy to have you in our developer community.</p>

      <a href="${clientURL}"
         style="background:#2563eb; color:white; padding:10px 20px;
                text-decoration:none; border-radius:5px;">
        Get Started
      </a>

      <p>Happy coding! 🚀</p>

      <p>— DevConnect Team</p>
    </div>
  `;
}