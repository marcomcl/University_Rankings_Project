# -*- coding: utf-8 -*-
"""
Created on Wed Jul  1 18:26:09 2020

@author: Michele
"""


import csv
import sys
import time
from datetime import datetime
from pathlib import Path


from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

#regular expression to convert not understandable values
import re


data = []
with open("2018_4thjuly.csv", mode='r', encoding="utf-8") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    print(csv_reader)
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            line_count += 1
            header = row # mi prendo la lista di attributi
        else:
            data.append(row)
            line_count += 1
    print(f'Processed {line_count} lines from files')
    

coordinatesLatLong = [] #toBeAdded
data_for_pca = []


for el in data:
   # cwur_world_rank = el[header.index("cwur_world_rank")]
    """
    data_for_pca.append(
        [float(el[header.index('sha_rank')]), float(el[header.index('the_rank')]),
         float(el[header.index('cwur_world_rank')]) ])"""
    
    
    stringa_sha_rank = el[header.index('sha_rank')]
    stringa_the_rank = el[header.index('the_rank')]
    
    lista_sha = []
    lista_the = []
    cwur_score_pca= el[header.index('cwur_score')]
        
        
    
    cwur_world_rank_pca = int(el[header.index('cwur_world_rank')])
    cwur_publications_pca =  el[header.index('cwur_publications')]
    scores_on_NS_pca =  el[header.index('Score on N&S')]
    scores_on_HiCi_pca  = el[header.index('Score on HiCi')]
    
    #gestion delle publications
    if ">" in cwur_publications_pca: 
            cwur_publications_pca = 1000
    else:
            cwur_publications_pca =  int(el[header.index('cwur_publications')])
    
    
    #gestione scores NS
    if scores_on_NS_pca  == "":     
            scores_on_NS_pca = "0.0"
            
     
    #gestione scores NS
    if scores_on_HiCi_pca  == "":     
            scores_on_HiCi_pca = "0.0"
    
    ###  #######
   # print("###",scores_on_NS_pca,"#######")
    
    
    #gestione su sha_rank e append
    if stringa_sha_rank == "":
       # print("bella")
        data_for_pca.append([int(1000), cwur_world_rank_pca ,   cwur_publications_pca, str(scores_on_NS_pca),  str(scores_on_HiCi_pca),str(cwur_score_pca) ]  )
    elif "-" in stringa_sha_rank :
        lista_sha = stringa_sha_rank.split("-")
        data_for_pca.append(   [ (int(lista_sha[0])+int(lista_sha[1]))/2 ,  cwur_world_rank_pca ,   cwur_publications_pca  , str(scores_on_NS_pca),  str( scores_on_HiCi_pca ) , str(cwur_score_pca)] )
    else:
        data_for_pca.append(  [  int(el[header.index('sha_rank')])       ,cwur_world_rank_pca ,  cwur_publications_pca  ,  str(scores_on_NS_pca),   str(scores_on_HiCi_pca) ,str(cwur_score_pca)] )
        
 
#print(data_for_pca)




scaled_data_for_pca = StandardScaler().fit_transform(data_for_pca)
pca = PCA(n_components=2)

#print(pca)

principalComponents = pca.fit_transform(scaled_data_for_pca)


from matplotlib import pyplot as plt
plt.plot(principalComponents[:, 0], principalComponents[:, 1], 'o', markersize=3, color='blue', alpha=0.5,
         label='PCA transformed data in the new 2D space')
plt.xlabel('Y1')
plt.ylabel('Y2')
plt.xlim([0, 20])
plt.ylim([0, 20])
plt.legend()
plt.title('Transformed data from sklearn.decomposition import PCA (7 attributes)')
plt.show()

with open("pca2018.csv", 'w', newline='',encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL)
    lenComponents = len(principalComponents)
    index = 0
    for el in data:
        if index == 0:
            header.extend(["PCA_component1", "PCA_component2"])
            writer.writerow(header)
        el.extend(principalComponents[index])
        writer.writerow(el)
        index += 1

