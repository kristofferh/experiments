Webcam API 
-----------------------

This is a webcam experiment. It uses the brand-spanking new <code>getUserMedia</code> API to access the webcam in the browser. Using webGL and [glfx](http://evanw.github.com/glfx.js/) you can set filters interactively on the webcam output.

Running locally
---------------

    git clone git@github.com:kristofferh/experiments.git
    Point a webserver to run experiments/cam in the root
    Open Google Chrome Canary, type in chrome://flags/.
    Enable MediaStream 
    Restart Google Chrome Canary. You should now be able to access the webcam.