# -*- coding: utf-8 -*-
"""
Created on Sat Aug  1 15:36:33 2020

@author: Michele
"""


import csv

with open('paesi.csv', newline='') as f:
    reader = csv.reader(f)
    data = list(reader)

#print(data)
lista = []
for i in data:
    print(i[0])
    lista.append(i[0])

print(lista)


mylist = list(dict.fromkeys(lista))
print(mylist)


