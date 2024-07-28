# Navi Assistant Extension

Navi Assistant Extension is an innovative tool designed to enhance the application development experience using natural language processing. This extension seamlessly integrates with MIT App Inventor, providing advanced assistance to developers.

## Table of Contents

- [Description](#description)
- [Components](#components)
- [Installation](#installation)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Description

The browser extension, specifically developed for chromium-based browsers, is a fundamental component of the NAVI Assistant tool. This extension captures and records the user's actions within the App Inventor environment. Its main functions include recognizing the user's emotions by capturing their face, notifying of global changes in the environment, such as project or workspace changes, and incorporating various listeners in the App Inventor environment development environment to capture information about events occurring in the workspaces. In addition, it deploys the chatbot and manages the responses of the conversational agent, facilitating bidirectional communication between the extension and the server by sending and receiving messages using Socket.IO.

## Components

- **Service Worker**. This component runs in the background, checking whether the extension has been installed for the first time or has been updated. Depending on each of these circumstances, the extension will provide an HTML document indicating the situation to the user. Additionally, this component is responsible for requesting access to the video camera from the browser to start the facial recognition performed by the `Face Listener` component.

- **Face Listener**. This component is responsible for emotion recognition by capturing the user's face using the `face-api.js` library. The process will not begin until the `Service Worker` and `Content` components have sent messages confirming that the video camera is on and the `face-api.js` library has been correctly added. Unlike other listeners, this component does not directly send captured data to the `Content` component; instead, it stores the data in a global variable accessed only by the `Websocket Exchanger` component when sending the record to the server. This is because facial recognition occurs constantly and is not tied to a specific event. Thus, when an event record is sent, it includes all emotions collected from the end of the previous event to the current event.

- **Block Listener**. This component registers all events occurring in the block space of the AI2 development environment. It accesses various JavaScript functions exposed by the AI2 development environment at runtime to capture block creation, modification, and deletion events. Once the data is collected, it is sent to the `Content` component for normalization and transmission to the server.

- **Global Listener**. This component notifies the `Content` component when global changes occur in the development environment, such as project or workspace changes. When the development environment elements have loaded correctly, it notifies the `Content` component to activate various listeners. This is necessary because the `Block Listener` and `Component Listener` components depend on the loading of different JavaScript objects and functions in the AI2 development environment to function.

- **Register**. This component includes the classes and methods necessary to generate objects that align with the predefined data model. The data model is structured according to the "subject-verb-object" syntax, following the xAPI software specification available at [xAPI](https://xapi.com/). The main purpose of this structure is to record learning activities and allow their analysis using learning analytics techniques.

- **Content**. This component is responsible for incorporating various `listener` elements into the development environment web page, each specializing in capturing information from different events occurring in the AI2 development environment. After their addition, the component collects the data recorded by these listeners, standardizes it, and transmits it to the `Websocket Exchanger` component. In addition to receiving and normalizing the data, this component also processes various server messages from the `Websocket Exchanger` component.

- **Dialog Listener**. This component deploys the chatbot in the development environment and manages the responses received from the conversational agent. It uses the Dialogflow Messenger integration tool provided by the Dialogflow platform to perform these tasks. This tool collects all data derived from the conversational agent's responses and allows the integration of custom responses not linked to the agent, adding new functions to the chatbot. It also offers options to customize various interface aspects, such as the chat bubble logo and color scheme.

- **Component Listener**. This component checks for changes in the elements that make up each screen of the application within App Inventor. Like the `Block Listener` component, it accesses various JavaScript functions available in the development environment in real-time to identify which parts have been added, deleted, or modified on each application screen. These events are not directly available since the development environment only provides the list of elements when queried. To recognize these events, the component periodically checks for changes in the element list. Each time the list is queried, it is stored, allowing comparison with the next query. When a variation in elements is detected, the collected data is sent to the `Content` component for standardization and subsequent transmission to the server.


## Installation

Follow these steps to install and set up the extension in your browser:

1. Clone this repository:
    ```bash
    git clone https://github.com/lordrubenbp/navi-assistant-extension.git
    ```
2. Navigate to the project directory:
    ```bash
    cd navi_assistant_extension
    ```
3. Open your browser and go to `chrome://extensions/`.
4. Enable "Developer mode" in the top right corner.
5. Click on "Load unpacked" and select the project folder.

## Features

The following list details the functionalities of the NAVI Assistant. These functionalities range from resolving common problems to developing guided projects, providing a comprehensive and educational tool for environmental users. The key functionalities are described below:

1. **Resolving common problems:** The chatbot helps solve common problems in the App Inventor development environment. The users must describe the problem. Unresolved issues are logged for future catalog updates.
   
2. **Providing information on key actions:** The chatbot provides information on performing actions in the App Inventor development environment. The response includes an animated image to illustrate the process and support the text.

3. **Providing information on App Inventor development environment elements:** The chatbot provides extended information about the fundamental elements of the App Inventor development environment.

4. **Analyzing and suggesting improvements to the developing project:** The chatbot evaluates the application, assigns a rating, and provides feedback, highlighting areas for improvement and suggesting beneficial modifications.

5. **Developing guided projects:** This function helps users learn the App Inventor development environment by developing guided projects under the supervision of the chatbot. The chatbot displays a catalog of projects including an image, the project name, difficulty, description, and a load button. Once loaded, the chatbot instructs users to download or update the necessary resources and can explain the steps if needed. After uploading, users start the project. The chatbot sequentially displays each step to complete the project. Upon completing all steps, the chatbot announces the project's completion and offers options to test or end-development. 

6. **User activity logging:** NAVI Assistant continuously monitors the state of the app in development and the user's interactions with the App Inventor interface. Additionally, it can optionally detect the user's emotions through the camera while they are working on the app.


## Contributing

Contributions are welcome! To contribute:

1. Fork the project.
2. Create a new branch (`git checkout -b feature-new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-new-feature`).
6. Open a Pull Request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

For any questions or inquiries, you can contact us through:

- **Email**: ruben.baena@uca.es
- **Website**: [Navi Assistant](https://naviassistant.com/)
