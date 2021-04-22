# Implementation of REyeker

REyeker is an Web Tool for visual attention tracking. It is written in Typescript and can thus be compiled into Javascript.
REyeker was designt to be a plug and play system for online survey Tools, we made an Implementation for SoSciSurvey.<br>

## Example SoSciSurvey

For Embedding the Tool into SoSciSurvey some Boilerplate must be lifted. 
This happens on the one hand on the code page and on the other hand on the website page.
We will go into this in detail below.<br>

This happens on the one hand on the code page and on the other hand on the website page. We will go into this in detail below.<br>

### Side of Code

For the code side, a new use case must be created in the corresponding class.
Furthermore, it is checked that only one useCase is active at a time. This happens in the file "useCase.ts" and looks as follows.

#### Use-Cases
````typescript
/**
 * Indicates that the REYEker tool will be uses on soSciSurvey
 */
public static soSciSurvey = false;

/**
 * checks if exactly one flag is set
 */
public static isValid() : boolean{
    let value : number = 0;
    if(UseCases.htmlTesting === true) value++;
    if(UseCases.soSciSurvey === true) value++;
    return value === 1;
}
````

##### Retrieving html elements
Now the addressing of the respective required HTML elements must be inserted.
This is done in the file "rEYEker.ts". Various changes must now be made here.
First, the HTML elements that are needed are loaded. Among them is the name of the image to be displayed,
the name of the variables (clickLog and timeStamp), and last but not least the canvas on which the image will be drawn.

````typescript
if (UseCases.soSciSurvey === true) {
    imageUrl = document.getElementById("imageToBlurTag").innerHTML; //the used test image, use an rgba (8 bit color depth) image
    variableNameClickLog = document.getElementById("clickLogVariable").innerHTML; //the name of the inner variable of soSci
    if(document.getElementById("timeLogVariable")!=null){
        variableNameTimeLog = document.getElementById("timeLogVariable").innerHTML; //the name of the inner variable of soSci
    }
    visibleImageCanvas = <HTMLCanvasElement>document.getElementById("visible-image-canvas");
}
````

#### Data Storage
Now a little code needs to be added so that the runtime saved data is persistently saved when the answers are submitted.
For this purpose, the Submit button of SoSciSurvey is addressed, which has the ID "submit0".
A function is added to this at the 'click' event, which serialises the runtime-stored data and stores it in the SoSciSurvey variables.

`````typescript
if (UseCases.soSciSurvey === true) {
    document.getElementById("submit0").addEventListener('click', function (event) {
        let log = eyeTrackImage.get_click_log();
        let data = "";
        for (let i = 0; i < log.length; i++) {
            data += log[i].get_x() + "-" + log[i].get_y() + " ";
        }
        (<HTMLInputElement>document.getElementById(variableNameClickLog)).value = data;
        if(variableNameTimeLog!=null){
            let log = eyeTrackImage.get_click_log_times();
            let data = "";
            for (let i = 0; i < log.length; i++) {
                data += log[i] + " ";
            }
            (<HTMLInputElement>document.getElementById(variableNameTimeLog)).value = data;
        }
    });
    calculateNew = true;
}
`````

#### End of code Boilerplate
Finally, the code can now be compiled into a single JavaScript file, which can now be found in the scripts folder and has the name "rEYEker.js".

### Side of SoSciSurvey

To start in SoSciSurvey, all images and script (rEYEker.js) must first be uploaded ("require.js" can also be uploaded or directly included via url). This is done in the tab Images and Mediafiles. After this has been done, the questions are created.

#### Creation of Variable, Embedding and Question

First of all, you have to create a new rubric, in which you can now create questions and text.
We start with the creation of the variables. To do this, a new question must be created and the type set to internal variable,
now a new variable can be created, it doesn't matter what it is called for the time being because we will reference it later in an HTML element. <br>

After that, we should write an embedding of the code, using a new text that we specify to display HTML. The following is an example embedding which shows all the possible settings.

````html
<!-- Load Scripts-->
<script src="./require.js"></script>
<script src="./rEYEker.js"></script>

<!-- Used for Displaying the blurred image in the background and the visible area in the foreground,. for performance reasons -->
<div style="position: relative;">
  <canvas id="bubble-image-canvas" style="position: relative; left: 0; top: 0; z-index: 0;"></canvas>
  <canvas id="visible-image-canvas" style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>
</div>
<!-- Used for the Image Name -->
<p id="imageToBlurTag" hidden>./InsertSort.PNG</p>

<!-- Reference the Name of the intern variables, use 2. one only if one need timestamps -->
<p id="clickLogVariable" hidden>N210_01</p>
<p id="timeLogVariable" hidden>N210_02</p>

<!-- Used for transition parameter -->
<p id="x_blur_radius" hidden>5</p>
<p id="y_blur_radius" hidden>5</p>

<!-- Used for transition parameter -->
<p id="grad_radius" hidden>15</p>

<!-- Used for rectangle parameters -->
<p id="minimal_width" hidden>120</p>
<p id="minimal_height" hidden>20</p>

<!-- Used for circle parameters -->
<p id="circle_radius" hidden>30</p>

<!-- Use for Ellipse parameters -->
<p id="ellipse_radius_x" hidden>120</p>
<p id="ellipse_radius_y" hidden>20</p>

<!-- Use one of the following for selecting the shape -->
<p id="use_rectangle" hidden></p>
<p id="use_circle" hidden></p>
<p id="use_ellipse" hidden></p>

<script>
     require(['rEYEker']);
</script>
````

Finally, a question can be created as desired.


#### Bringing it together

In order to bring these 3 parts together, a new page must be created in the questionnaire, which can be modified via drag and drop.
Modify the page so that first the variable, then the embedding and finally the question is on one page.

### Data

The collected data, if any, is now displayed under the corresponding tab. These are formatted so that x and y values of a click are formatted with a hyphen.
Different clicks are separated by a space. The timestamps are also separated by a space and displayed in ms.

## Example of click Data

````text
160-27 189-50 188-69 242-50 193-76 164-98 180-150 270-145 222-164 219-179 239-194 252-212 248-218 249-234 249-219 190-244 139-274 205-362 205-382 205-400 206-359 207-371 262-378 255-390 202-403
````

## Example of timestamp Data
````text
1834 3233 5051 6790 8651 10517 12301 14251 18286 21087 24038 24339
````

## Example HTML Testing

Set the Flag for HTMl Testing compile the code and start a webserver hosting the index.html.
