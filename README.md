# 🧠 CathQuiz
This project is a comprehensive Vue.js application that utilizes Firebase for authentication and database management, and Vuetify for a material design-inspired interface. The application features a robust state management system using Vuex, with modules for user authentication, quiz management, and error handling. The project is designed to provide a scalable and maintainable architecture for complex web applications.

## 🚀 Features
* User authentication and authorization using Firebase
* Quiz management system with participant tracking and answer updates
* Error handling and display using a centralized state management system
* Material design-inspired interface using Vuetify
* Robust state management system using Vuex
* Modular architecture for easy maintenance and scalability

## 🛠️ Tech Stack
* Frontend: Vue.js, Vuetify
* Backend: Firebase
* State Management: Vuex
* Database: Firebase Realtime Database
* Authentication: Firebase Authentication
* Build Tool: Webpack
* Dependencies: Vue Clipboard, Vue Awesome Countdown, Vue Local Storage, Moment.js

## 📦 Installation
To get started with the project, follow these steps:
1. Clone the repository using `git clone`
2. Install the dependencies using `npm install`
3. Set up a Firebase project and enable the Realtime Database and Authentication
4. Create a `firebase.js` file in the `src/config` directory with your Firebase configuration settings
5. Run the application using `npm run serve`

## 💻 Usage
To use the application, simply navigate to the URL provided by the development server. The application will guide you through the authentication and quiz management process.

## 📂 Project Structure
```markdown
.
├── public
├── src
│   ├── main.js
│   ├── router
│   │   ├── index.js
│   ├── store
│   │   ├── index.js
│   │   ├── modules
│   │   │   ├── user.js
│   │   │   ├── quiz.js
│   │   │   ├── general.js
│   ├── config
│   │   ├── firebase.js
│   ├── plugins
│   │   ├── vuetify.js
│   ├── views
│   ├── components
│   ├── assets
│   ├── utils
├── vue.config.js
```

## 🤝 Contributing
To contribute to the project, please submit a pull request with a detailed description of the changes made. Ensure that all tests are passing and the code is formatted according to the project's standards.

## 📝 License
This project is licensed under the MIT License.

## 📬 Contact
For any questions or concerns, please contact us at [glebanya.com@gmail.com](mailto:glebanya.com@gmail.com).
