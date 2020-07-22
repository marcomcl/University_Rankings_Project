# -*- coding: utf-8 -*-
"""
Created on Mon Jul  6 17:07:29 2020

@author: Michele
"""

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
with open("finalDataset.csv", mode='r', encoding="utf-8") as csv_file:
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

counter = 0;
for el in data:
   # cwur_world_rank = el[header.index("cwur_world_rank")]
    
    #attributes scelti
    #latitude =  el[header.index('latitude')]
    #longitude =  el[header.index('longitude')]
    
    the_teaching = el[header.index('the_teaching')]
    the_research = el[header.index('the_reseach')]
    the_citations = el[header.index('the_citations')]
    the_international_outlook =  el[header.index('the_international_outlook')]
    latitude = el[header.index('latitude')]
    longitude = el[header.index('longitude')] 
    if latitude == "":
        print("Bella ciao ciao ciao")
        #data_for_pca.append([str(the_Teaching),str(the_Research), str(the_Citations), str(the_International_Outlook),str(latitude),str(longitude)])
    else:
        print("---------> ",latitude)
        print("---------> ",longitude)
        print(the_teaching," ", the_research);
        data_for_pca.append([str(the_teaching),str(the_research), str(the_citations), str(the_international_outlook),str(latitude),str(longitude)])
    counter += 1
    
   
    

print(counter);

        
  
     
    #data_for_pca.append([latitude,longitude, sha_rank_pca,cwur_rank_pca])
 
#print(data_for_pca)




scaled_data_for_pca = StandardScaler().fit_transform(data_for_pca)
pca = PCA(n_components=2)

print("ciao\n",pca)

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

with open("finaDataset.csv", 'w', newline='',encoding="utf-8") as csvfile:
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


