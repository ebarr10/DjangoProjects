from django.shortcuts import render, HttpResponse

# Create your views here.
def homepage(request):
    return HttpResponse("<a href='/language'>Language Game</a>")