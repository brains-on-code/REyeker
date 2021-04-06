#!/usr/bin/env python
# coding: utf-8

# In[8]:


import pandas as pd
import modules.rEYEkerAnalysis as rEYEker
import modules.clickSettings as clk
import multiprocessing
from joblib import Parallel, delayed

# In[9]:


df = pd.read_excel('Book4.xlsx', skiprows=[1])
df.head(10)


# # Gender Stats

# In[10]:


pd07dict = {1:"male", 2:"female", 3:"other", -9:"not answered"}
df['PD07'].value_counts().rename(index=pd07dict)


# # Utility

CORES = multiprocessing.cpu_count()


def to_click_vector(click_str):
    click_data = []
    click_str = click_str.strip();
    coordinates_str = click_str.split(" ")
    coordinates = []
    for coordinate_str in coordinates_str:
        #remove all whitespaces
        coordinate_str = coordinate_str.join(coordinate_str.split())
        coordinate = coordinate_str.split("-")
        try:
            coordinate = (int(coordinate[0]), int(coordinate[1]))
            coordinates.append(coordinate)
        except ValueError:
            print("invalid coordinate {} in coordinate string {}".format(coordinate, coordinates_str))
    click_data.append(coordinates)
    
    return click_data

click_setting = clk.ClickSettings()
#adjust to
click_setting.minimal_width = 200
click_setting.minimal_height = 10
click_setting.grad_radius = 20


def generate_heatmaps(image, clks, df, indexes, column_name):
    return Parallel(n_jobs=CORES)(delayed(generate_heatmap)(image, clks, df, i, column_name) for i in indexes)


def generate_heatmap(image, clks, df, i , column_name):
    click_str = df.at[i, column_name]
    click_vector = to_click_vector(click_str)
    data = click_vector
    return rEYEker.draw_shape_heat_map(image, 0, len(data[0]), data[0], clks, should_copy=True)


def display_all(heatmaps):
    for heatmap in heatmaps:
        rEYEker.display(heatmap, normal_size = True, axis_on=False)


def save_all(heatmaps, df, path):
    n = 0
    for i in df.index:
        rEYEker.save(heatmaps[n], path + "_" + str(df.at[i,'CASE']) + ".PNG")
        n += 1


# # Common Variables

# In[12]:


# analysis population samples
female = 'x'
male = 'y'
# approaches
tr = 'TR' # top recursive
br = 'BR' # bottom down recursive
ti = 'TI' # top down iterative
bi = 'BI' # bottom up iterative
#algorithms
bubble = 'bubblesort'
factorial = 'factorial'
fibonacci = 'fibonacci'
rstring = 'rstring'
#image paths
bsort = "images\\{}\\{}_BubbleSort.PNG"
fct = "images\\{}\\{}_Factorial.PNG"
fib = "images\\{}\\{}_Fibonacci.PNG"
rs = "images\\{}\\{}_ReverseString.PNG"


# # Female and Male Samples

df_female = df.loc[df['PD07'] == 2.0]
df_male = df.loc[df['PD07'] == 1.0]


# # TR18_01 ClickVector TopDownRecursive bubble sort

col = tr + '18_01'
df_tr_bsort_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(bsort.format(tr,tr))

heatmaps = generate_heatmaps(image, click_setting, df_tr_bsort_fem, df_tr_bsort_fem.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_tr_bsort_fem, "images\\heatmaps\\bubbleSort_{}_{}".format(tr,female))

df_tr_bsort_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_tr_bsort_male, df_tr_bsort_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_tr_bsort_male, "images\\heatmaps\\bubbleSort_{}_{}".format(tr,male))


# # TR19_01 ClickVector TopDownRecursive factorial

col = tr + '19_01'
df_tr_fct_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(fct.format(tr,tr))

heatmaps = generate_heatmaps(image, click_setting, df_tr_fct_fem, df_tr_fct_fem.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_tr_fct_fem, "images\\heatmaps\\factorial_{}_{}".format(tr,female))

df_tr_fct_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_tr_fct_male, df_tr_fct_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_tr_fct_male, "images\\heatmaps\\factorial_{}_{}".format(tr,male))


# # TR20_01 ClickVector TopDownRecursive fibonacci

col = tr + '20_01'
df_tr_fib_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(fib.format(tr,tr))

heatmaps = generate_heatmaps(image, click_setting, df_tr_fib_fem, df_tr_fib_fem.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_tr_fib_fem, "images\\heatmaps\\fibonacci_{}_{}".format(tr,female))

df_tr_fib_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_tr_fib_male, df_tr_fib_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_tr_fib_male, "images\\heatmaps\\fibonacci_{}_{}".format(tr,male))


# # TR21_01 ClickVector TopDownRecursive reverse string

col = tr + '21_01'
df_tr_rs_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(rs.format(tr,tr))

heatmaps = generate_heatmaps(image, click_setting, df_tr_rs_fem, df_tr_rs_fem.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_tr_rs_fem, "images\\heatmaps\\reverse_string_{}_{}".format(tr,female))

df_tr_rs_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_tr_rs_male, df_tr_rs_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_tr_rs_male, "images\\heatmaps\\reverse_string_{}_{}".format(tr,male))


# # TI18_01 ClickVector TopDownIterative bubble sort

col = ti + '18_01'
df_ti_bsort_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(bsort.format(ti,ti))

heatmaps = generate_heatmaps(image, click_setting, df_ti_bsort_fem, df_ti_bsort_fem.index, col)
#display_all(heatmaps)


save_all(heatmaps, df_ti_bsort_fem, "images\\heatmaps\\bubbleSort_{}_{}".format(ti,female))

df_ti_bsort_male = df_male.loc[df_male[col].notna()]

heatmaps = generate_heatmaps(image, click_setting, df_ti_bsort_male, df_ti_bsort_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_ti_bsort_male, "images\\heatmaps\\bubbleSort_{}_{}".format(ti,male))


# # TI19_01 ClickVector TopDownIterative factorial


col = ti + '19_01'
df_ti_fct_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(fct.format(ti,ti))

heatmaps = generate_heatmaps(image, click_setting, df_ti_fct_fem, df_ti_fct_fem.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_ti_fct_fem, "images\\heatmaps\\factorial_{}_{}".format(ti,female))

df_ti_fct_male = df_male.loc[df_male[col].notna()]

image = rEYEker.load_image(fct.format(ti,ti))

heatmaps = generate_heatmaps(image, click_setting, df_ti_fct_male, df_ti_fct_male.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_ti_fct_male, "images\\heatmaps\\factorial_{}_{}".format(ti,male))


# # TI20_01 ClickVector TopDownIterative fibonacci

col = ti + '20_01'
df_ti_fib_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(fib.format(ti,ti))

heatmaps = generate_heatmaps(image, click_setting, df_ti_fib_fem, df_ti_fib_fem.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_ti_fib_fem, "images\\heatmaps\\fibonacci_{}_{}".format(ti,female))

df_ti_fib_male = df_male.loc[df_male[col].notna()]

heatmaps = generate_heatmaps(image, click_setting, df_ti_fib_male, df_ti_fib_male.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_ti_fib_male, "images\\heatmaps\\fibonacci_{}_{}".format(ti,male))


# # TI21_01 ClickVector TopDownIterative reverse string

col = ti + '21_01'
df_ti_rs_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(rs.format(ti,ti))

heatmaps = generate_heatmaps(image, click_setting, df_ti_rs_fem, df_ti_rs_fem.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_ti_rs_fem, "images\\heatmaps\\reverse_string_{}_{}".format(ti,female))

df_ti_rs_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_ti_rs_male, df_ti_rs_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_ti_rs_male, "images\\heatmaps\\reverse_string_{}_{}".format(ti,male))


# # BR18_01 ClickVector BottomUpRecursive bubble sort

col = br + '18_01'
df_br_bsort_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(bsort.format(br,br))

heatmaps = generate_heatmaps(image, click_setting, df_br_bsort_fem, df_br_bsort_fem.index, col)
#display_all(heatmaps)


save_all(heatmaps, df_br_bsort_fem, "images\\heatmaps\\bubbleSort_{}_{}".format(br,female))

df_br_bsort_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_br_bsort_male, df_br_bsort_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_br_bsort_male, "images\\heatmaps\\bubbleSort_{}_{}".format(br,male))


# # BR19_01 ClickVector BottomUpRecursive factorial

col = br + '19_01'
df_br_fct_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(fct.format(br,br))

heatmaps = generate_heatmaps(image, click_setting, df_br_fct_fem, df_br_fct_fem.index, col)
#display_all(heatmaps)


save_all(heatmaps, df_br_fct_fem, "images\\heatmaps\\factorial_{}_{}".format(br,female))


df_br_fct_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_br_fct_male, df_br_fct_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_br_fct_male, "images\\heatmaps\\factorial_{}_{}".format(br,male))


# # BR20_01 ClickVector BottomUpRecursive fibonacci

col = br + '20_01'
df_br_fib_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(fib.format(br,br))

heatmaps = generate_heatmaps(image, click_setting, df_br_fib_fem, df_br_fib_fem.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_br_fib_fem, "images\\heatmaps\\fibonacci_{}_{}".format(br,female))

col = br + '20_01'
df_br_fib_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_br_fib_male, df_br_fib_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_br_fib_male, "images\\heatmaps\\fibonacci_{}_{}".format(br,male))


# # BR21_01 ClickVector BottomUpRecursive reverse string

col = br + '21_01'
df_br_rs_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(rs.format(br,br))

heatmaps = generate_heatmaps(image, click_setting, df_br_rs_fem, df_br_rs_fem.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_br_rs_fem, "images\\heatmaps\\reverse_string_{}_{}".format(br,female))

df_br_rs_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_br_rs_male, df_br_rs_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_br_rs_male, "images\\heatmaps\\reverse_string_{}_{}".format(br,male))


# # BI18_01 ClickVector BottomUpIterative bubble sort


col = bi + '18_01'
df_bi_bsort_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(bsort.format(bi,bi))

heatmaps = generate_heatmaps(image, click_setting, df_bi_bsort_fem, df_bi_bsort_fem.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_bi_bsort_fem, "images\\heatmaps\\bubbleSort_{}_{}".format(bi,female))

df_bi_bsort_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_bi_bsort_male, df_bi_bsort_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_bi_bsort_male, "images\\heatmaps\\bubbleSort_{}_{}".format(bi,male))


# # BI19_01 ClickVector BottomUpIterative factorial
col = bi + '19_01'
df_bi_fct_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(fct.format(bi,bi))

heatmaps = generate_heatmaps(image, click_setting, df_bi_fct_fem, df_bi_fct_fem.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_bi_fct_fem, "images\\heatmaps\\factorial_{}_{}".format(bi,female))

df_bi_fct_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_bi_fct_male, df_bi_fct_male.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_bi_fct_male, "images\\heatmaps\\factorial_{}_{}".format(bi,male))


# # BI20_01 ClickVector BottomUpIterative fibonacci

col = bi + '20_01'
df_bi_fib_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(fib.format(bi,bi))

heatmaps = generate_heatmaps(image, click_setting, df_bi_fib_fem, df_bi_fib_fem.index, col)
#display_all(heatmaps)

save_all(heatmaps, df_bi_fib_fem, "images\\heatmaps\\fibonacci_{}_{}".format(bi,female))

df_bi_fib_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_bi_fib_male, df_bi_fib_male.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_bi_fib_male, "images\\heatmaps\\fibonacci_{}_{}".format(bi,male))


# # BI21_01 ClickVector TopDownIterative reverse string
col = bi + '21_01'
df_bi_rs_fem = df_female.loc[df_female[col].notna()]

image = rEYEker.load_image(rs.format(bi,bi))

heatmaps = generate_heatmaps(image, click_setting, df_bi_rs_fem, df_bi_rs_fem.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_bi_rs_fem, "images\\heatmaps\\reverse_string_{}_{}".format(bi,female))


df_bi_rs_male = df_male.loc[df_male[col].notna()]
heatmaps = generate_heatmaps(image, click_setting, df_bi_rs_male, df_bi_rs_male.index, col)
#display_all(heatmaps)
save_all(heatmaps, df_bi_rs_male, "images\\heatmaps\\reverse_string_{}_{}".format(bi,male))

