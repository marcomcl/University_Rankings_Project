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

#############################################################################
#                   first PCA per lo studente
#############################################################################
data = []
with open("finalDataset.csv", mode='r', encoding="utf-8") as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    #print(csv_reader)
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
counter2 = 0;
counter_data = 0;
for el in data:
    #if counter_data < 10:
    cwur_world_rank = el[header.index("cwur_world_rank")]
    sha_rank = el[header.index("sha_World Rank")]
    #the_rank = el[header.index("the_rank")]
    #print("el vale: ",el)
    #attributes scelti
    #latitude =  el[header.index('latitude')]
    #longitude =  el[header.index('longitude')]
    #the_rank = el[header.index()]
    the_teaching = el[header.index('the_teaching')]
    the_research = el[header.index('the_reseach')]
    the_citations = el[header.index('the_citations')]
    the_international_outlook =  el[header.index('the_international_outlook')]
    latitude = el[header.index('latitude')]
    longitude = el[header.index('longitude')] 
    if latitude == "":
        print("Bella ciao ciao ciao")
        #counter2 += 1
        #data_for_pca.append([str(the_Teaching),str(the_Research), str(the_Citations), str(the_International_Outlook),str(latitude),str(longitude)])
    else:
        #print("---------> ",latitude)
        #print("---------> ",longitude)
        #print(the_teaching," ", the_research)
        #print("cwur_world_rank   -> ",cwur_world_rank)
        #print("year   -> ",year)
        #print("sha rank  -> ", sha_rank)
        pca1 = str(the_teaching)
        pca2 = str(the_research)
        pca3 = str(the_citations)
        pca4 = str(the_international_outlook)
        pca5 = str(latitude)
        pca6 = str(longitude)
        pca7 = str(sha_rank)
        pca8 = str(cwur_world_rank)
        #pca9 = str(the_rank)
        
        #gestione pca7
        if "-" in pca7:
            new_pca7 = pca7.split("-")
            #print("- in pca7")
            pca7 = ((float(new_pca7[0])-1) + float(new_pca7[1]))/2
            pca7 = str(pca7)
            #print("new_pca_7 : ",new_pca7)
            #print("pca7 finale : ",pca7)
        
        
        
        
        
        #print("the_rank = ", pca9)
        counter2 += 1
        data_for_pca.append([pca1,pca2,pca3,pca4,pca5,pca6,pca7,pca8])
    counter += 1
    #counter_data += 1
    
   
    

print(counter);
print(counter2);
#print(counter_data);
        
  
     
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

#############################################################################
#                   second PCA per il rettore
#############################################################################

data = []
with open("finaDatasetPCAon7att.csv", mode='r', encoding="utf-8") as csv_file:
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
counter2 = 0;
counter3 = 0;
counter4 = 0;

counter_data = 0;
for el in data:


    cwur_quality_of_education = el[header.index('cwur_quality_of_education')]
    cwur_quality_of_faculty = el[header.index('cwur_quality_of_faculty')]
    cwur_influence = el[header.index('cwur_influence')]
    
    the_research = el[header.index('the_reseach')]
    the_citations = el[header.index('the_citations')]
    
      
    
     
    pca1 = str(cwur_quality_of_education)
    pca2 = str(cwur_quality_of_faculty)
    pca3 = str(cwur_influence)
    pca4 = str(the_research)
    pca5 = str(the_citations)
    
    
    #print("cwur_influence ",pca3)
    #gestione pca 3
    if "-" in pca3:
        #print("cwur_influence ",pca3)
        pca3 = 0
        counter4 += 1
    elif "+" in pca3:
        #print(pca3)
        new_pca3 = pca3.split("+")
        pca3 = new_pca3[0]
        #print("pca3   ", pca3)
    elif ">" in pca3:
        #print(pca2)
        
        new_pca3 = pca3.split(">")
        pca3 = new_pca3[1]
        #print("pca3  ", pca3)
    #gestion pca2 
    if "-" in pca2:
    
        #print("cwur_quality_of_faculty = ", pca2)
        pca2 = 0
        counter3 += 1
        #data_for_pca.append([pca1])
    elif "+" in pca2:
        #print(pca2)
        
        new_pca2 = pca2.split("+")
        pca2 = new_pca2[0]
        #print("pca2  ", pca2)   
    elif ">" in pca2:
        #print(pca2)
        
        #new_pca1 = pca1.split(">")
        #pca1 = new_pca1[0]
        print("pca2  ", pca2)
        
    #gestion pca1 
    if "-" in pca1:
    
        #print("cwur_quality_of_education = ", pca1)
        pca1 = 0
        counter2 += 1
        #data_for_pca.append([pca1])
    elif "+" in pca1:
        #print(pca2)
        
        new_pca1 = pca1.split("+")
        pca1 = new_pca1[0]
        #print("pca1  ", pca1)
    elif ">" in pca1:
        #print(pca2)
        
        #new_pca1 = pca1.split(">")
        #pca1 = new_pca1[0]
        print("pca1  ", pca1)
    #counter += 1

    
   
    

    #print(counter)
    #print(counter2)
    #print(counter3)
    #print(counter4)   
  
     
    data_for_pca.append([pca1,pca2,pca3,pca4,pca5])
 
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
    print(header)
    writer = csv.writer(csvfile, delimiter=',', quoting=csv.QUOTE_MINIMAL)
    lenComponents = len(principalComponents)
    index = 0
    for el in data:
        if index == 0:
            header.extend(["PCA_component3", "PCA_component4"])
            writer.writerow(header)
        el.extend(principalComponents[index])
        writer.writerow(el)
        index += 1


