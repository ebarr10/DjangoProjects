from django.test import TestCase
import csv

# Create your tests here.
keyword = 'basic'
reader = []
with open('./static/data_csv/en-de_'+keyword+'.csv', newline='') as csvfile:
    reader = list(csv.DictReader(csvfile))

print(reader)