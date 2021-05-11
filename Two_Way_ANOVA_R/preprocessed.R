library(readxl)
library(ggplot2)
library(ggpubr)
library(carData)
library(car)

#Anova for all the correct and wrong responses without outliers

data_all <- read.csv("C:/Users/Arooba/OneDrive/Desktop/TestData/Two_Way_ANOVA_R/data_of_all_removed_v1.csv", sep=",")
r.aov_all <- Anova(lm(ResponseTime ~ ProgrammingStyle * Comprehension, data_all, contrasts = list(ProgrammingStyle=contr.sum, Comprehension=contr.sum)),type=3)
r.aov_all
effectsize::eta_squared(r.aov_all)


data_correct <- read.csv("C:/Users/Arooba/OneDrive/Desktop/TestDataTwo_Way_ANOVA_R/data_of_corrects_v1.csv", sep=",")
r.aov_correct <- Anova(lm(ResponseTime ~ ProgrammingStyle * Comprehension, data_correct, contrasts = list(ProgrammingStyle=contr.sum, Comprehension=contr.sum)),type=3)
r.aov_correct
effectsize::eta_squared(r.aov_correct)