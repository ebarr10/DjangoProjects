from django.views.generic import TemplateView
from django.shortcuts import HttpResponse
from django.contrib.staticfiles.storage import staticfiles_storage
import csv, json

# Create your views here.
class GameView(TemplateView):
    template_name="index.html"
    

def csvDownload(request):
    keyword = request.GET.get('keyword')

    reader = []
    url = staticfiles_storage.path('data/en-de_'+keyword+'.csv')
    with open(url, 'r', newline='') as csvfile:
        reader = list(csv.DictReader(csvfile))
    
    data = json.dumps(reader)
    print("data", data)
    return HttpResponse(data)