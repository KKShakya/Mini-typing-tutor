# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

# Variables naming

-- most of the states managed by redux store

### Redux

1. visualText is for User view What to type

2. combinations is to derive how many words to be included

3. repitition is to repeat those combinations

4. next is to set new visualText once user finishes all the text correctly

5. startTimer = 300 seconds === 5 minutes

6. minutes and seconds are timer related updations

7. n is the length of words


 </br>
 </br>

### useState

1. WPM checks for Words per minute

2. current index checks for the visual text and typed text character matching

3. correctChar Char checks for the length of correct user input

4. totalTyped Char checks for the length of total user input, to calulate WPM typed


 </br>
 </br>

### App working

1. The app loads and the timer starts with foucs on the typing area textbox;

2. As the user types in the sounds are managed for correct and wrong keys with background changes to red;

3. User can reset the timer, change number of words from source, generate multiple combinations and repetitions.

 </br>
 </br>


## screenshots

![Home page Image](./src/assets/images/Screenshot%20(247).png)
