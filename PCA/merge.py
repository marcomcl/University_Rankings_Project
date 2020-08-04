# -*- coding: utf-8 -*-
"""
Created on Wed Jun 24 18:10:17 2020

@author: Michele
"""


import pandas as pd
import os
import glob
"""
for i in range(2012,2020):
    
    #creazione dei file tc (join di THE e cwur)

    a = pd.read_csv("single years/t"+str(i)+".csv", keep_default_na=False, na_values=[""])

    b = pd.read_csv("single years/c"+str(i)+".csv", keep_default_na=False, na_values=[""])



    last_merged_left = pd.merge(left=a, right=b, how='inner', left_on='the_institution', right_on='cwur_institution')

    last_merged_left.to_csv("tc/inner/tc"+str(i)+".csv",index=False)
   
    
     #creazione dei file tcs (join di tc e shanghai)
    
    c = pd.read_csv("tc/inner/tc"+str(i)+".csv", keep_default_na=False, na_values=[""])

    d = pd.read_csv("single years/s"+str(i)+".csv", keep_default_na=False, na_values=[""])



    last_merged_left = pd.merge(left=c, right=d, how='inner', left_on='the_institution', right_on='sha_institution')

    last_merged_left.to_csv("tcs/inner/tcs"+str(i)+".csv",index=False)
 

    
    #join con latitudes and longitudes
    
      #creazione dei file tcs (join di tc e shanghai)

    e = pd.read_csv("tcs/inner/tcs"+str(i)+".csv", keep_default_na=False, na_values=[""])

    f = pd.read_csv("tcsLatLong/latLong.csv", keep_default_na=False, na_values=[""])



    last_merged_left = pd.merge(left=e, right=f, how='inner', left_on='the_institution', right_on='institution')

    last_merged_left.to_csv("tcsLatLong/inner/tcsLatLong"+str(i)+".csv",index=False)
 
    
    if i == 2019:
        #merge of all datasets, final dataset
        extension = 'csv'
        all_filenames = [j for j in glob.glob('tcsLatLong/inner/tcsLatLong*'.format(extension))]
        #combine all files in the list
        combined_csv = pd.concat([pd.read_csv(f) for f in all_filenames ])
        #export to csv
        combined_csv.to_csv( "tcsLatLong/inner/finalDataset.csv", index=False, encoding='utf-8-sig')

"""
a = pd.read_csv("tcsLatLong/inner/finalDataset.csv", keep_default_na=False, na_values=[""])

b = pd.read_csv("numbeo2020_1st_semester.csv", keep_default_na=False, na_values=[""])  

last_merged_left = pd.merge(left=a, right=b, how='inner', left_on='the_country', right_on='nazione')

last_merged_left.to_csv("dataSetConNumbeo_4Agosto.csv",index=False) 





