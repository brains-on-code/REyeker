rEYEker uses typescript for compiling to javascript. So make sure you have a typescript compiler when changing and using the programm.

To using the Tool check out the following steps:

In the src/useCases.ts of the Tool there are some Flags, theese should be used xor wise.
There are the following Tags with different applications
	htmlTesting 	- for testing the code and setting parameters on the fly
	soSciSurvey 	- for integrating the tool in So Sci Survey
	onyx 		 	- (work in progress) for integrating the tool into onyx
	dataAnaylsis	- used for faster analysing the click lOg


html Testing
	Make sure the html Testing flag is set.
	
	Make sure that in the same directory are the Images with the Names:
	"InsertSort.PNG", "Calculation.PNG", "Rectangle.PNG". If you want to change the folder or the file
	look for "A Section for global variables" and change ex_1_url, ex_2_url, ex_3_url.
	Make sure that the Images are formattet in an 8 Bit Color Depth RGB(A) format.
	Also supply some html code, for useriterface interactions:
	
	<h3>html Testing</h3>
        <label id="xFoldingRangeLabel"> [2]</label>             <input type="range" min="1" max="50"  value="5" class="slider" id="xFoldingRange"><br>
        <label id="yFoldingRangeLabel"> [2]</label>             <input type="range" min="1" max="50"  value="5" class="slider" id="yFoldingRange"><br>
        <label id="minimalXVisibilityLabel"> [50]</label>  <input type="range" min="1" max="200" value="50" class="slider" id="minimalXVisibility"><br>
        <label id="minimalYVisibilityLabel"> [50]</label>  <input type="range" min="1" max="200" value="50" class="slider" id="minimalYVisibility"><br>
        <label id="blurRadiusLabel"> [50]</label>                   <input type="range" min="1" max="200" value="50" class="slider" id="blurRadius"><br>
        <label id="blurXRatioLabel"> [100]%</label>                <input type="range" min="1" max="100" value="100" class="slider" id="blurXRatio"><br>
        <label id="blurYRatioLabel"> [100]%</label>                <input type="range" min="1" max="100" value="100" class="slider" id="blurYRatio"><br>
        <br>
        <input type="checkbox" id="mouseClickActivation" checked><br>
        <br>
        <br>
        <input type="checkbox" id="ex_1" checked="true"> <br>
        <input type="checkbox" id="ex_2"> <br>
        <input type="checkbox" id="ex_3"> <br>
    </div>
	
	<div class="Image">
        <div style="position: relative;">
            <canvas id="bubble-image-canvas" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>
            <canvas id="visible-image-canvas" style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>
        </div>
    </div>

soSciSurvey
	Make sure the soSciSurvey flag is set.

	The cleanest way to setup the Tool for SoScy is to use 3 Parts. One Embedding, one VariableSaver, one Question part(if needed)
	First of all you will need to upload the image to SoScy, you can do this in the media tab. Make Sure The Image is in 
	8-Bit-Depth RGB(A) format. You will also need to upload the file "bubbleTool.js" (name in progress).
	
	Now you can set up the Variablepart. If you image is called "InsertSort.PNG" may call this part "InsertSortClickLog".
	To add this part add a new question with the type "inner Variable". Create a new variable under the tag [01] and call it "clickLogVector".
	
	For the Embedding you need to write some html. Create a new Text.
	If you image is called "InsertSort.PNG" may call this part "InsertSortEmbedding". 
	You will need to supply the following items:
	
		<script src="./require.js"></script>
		<script src="./rEYEker.js"></script>

		<div style="position: relative;">
			<canvas id="bubble-image-canvas" style="position: absolue; left: 0; top: 0; z-index: 0;"></canvas>
			<canvas id="visible-image-canvas" style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>
		</div>

		<p id="imageToBlurTag" hidden>./InsertSort.PNG</p>
		<p id="clickLogVariable" hidden>$TheNumberFromYOurVariable_01</p>

		<script>
			require(['rEYEker']);
		</script>
	
	For the Querstion, just create a new Question and feel free to ask anything.
	
	For putting together all the Parts, create a questionnaire and use the order 
	->variablepart
	->embedding
	->(may your extras)
	
	To Change the attributes go to "block : customize attributes".
	Change the values as you want to the amount of their definition range, you can test theese parameters with html testing.
	
dataAnaylsis
	Make sure the dataAnaylsis flag is set.
	
	Add the Image to the root folder of you server and change the variable "imageWithDataOfClickLog" to the Name of The Image.
	Make sure the Image is in 8-Bit_depth-RGB(A) format.
	
	Change the "clickDataSaver" class. Change the "imageWithDataOfClickLog" to the path of the image you want to analyse. Change the "clickLogData"
	to an array of strings in the following format ["x0-y0 x1-y1 ... xn-yn", "x0-y0 ... xm-ym", ...] you can obtain a string of the format in SoScySurvey.
	
	Supply the following html elements:
	
	<div class="dataAnalysis">
        <h3>data analysis</h3>
        <input type="range" min="0" max="0" value="0" id="clickLogDataSetBar"><br>
        <input type="checkbox" id="lineViewCheckbox" ><br>
        <input type="checkbox" id="rowViewCheckbox" ><br>
        <input type="checkbox" id="rectangleViewCheckbox" ><br><br>

        <input type="checkbox" id="verticalViewCheckbox" checked ><br>
        <input type="checkbox" id="horizontalViewCheckbox" ><br><br>

        <input type="checkbox" id="verticalHeatmapCheckbox" ><br>
        <input type="checkbox" id="horizontalHeatmapCheckbox" ><br>
        <input type="checkbox" id="rectangleHeatmapCheckbox" ><br><br>

        <input type="range" min="0" max="0" value="0" class="slider" id="clickLogActivationBarMax"><br>
        <input type="range" min="0" max="0" value="0" class="slider" id="clickLogActivationBarMin"><br>
    </div>
    <div class="Image">
        <div style="position: relative;">
            <canvas id="bubble-image-canvas" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>
            <canvas id="click-log-canvas" style="position: relative; left: 0; top: 0; z-index: 2;"></canvas>
        </div>
    </div>

	
	
	