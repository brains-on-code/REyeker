# REyeker Data Analysis

The data analysis or visualisation can be done through different diagrams. 
But first of all, the parameters of the conducted study have to be set.
First, the image should be set by a relative path under "image URL", the example "InsertSort.PNG" is set initially, 
then the click data and optionally the timestamp data can be set. If these are not set, they will not be used on the data set.
Any number of data sets can now be loaded. Data sets can also be loaded from .json files,
an example and a schema file are available in the "data" folder. Now the different data sets can be selected by a slider.
The start and end point of the visualisation can also be set by "Click Log Max" and "Click Log Min".
Furthermore, the respective shape (rectangle, circle, ellipse) with the corresponding parameters can be set under Shapes. 
Now various diagrams can be selected by means of the checkboxes, including line, row, shape views, vertical and horizontal line diagrams and heat maps.
<br>
<br>
Furthermore, the Needleman Wunsch algorithm (https://de.wikipedia.org/wiki/Needleman-Wunsch-Algorithmus)
can be used to check different sequences for similarity.
But since the Needleman Wunsch diagram would be too unreliable, classes have to be set to fit the click data.
This can be done by grouping on the basis of the y
data or by semantic classifiers (http://users.sussex.ac.uk/~bend/ppig2014/12ppig2014_submission_7.pdf).
These can be set by clicking with the left mouse click and holding SHIFT for the "upper" and ctrl for the "lower"
bound. You can make them visible by checking the checkbox and then selecting the classifier type you want to set.