jQuery(document).ready(function( $ ) {
  $("nav#menu").mmenu({
     "extensions": [
        "pagedim-black",
        "shadow-page"
     ],
     "offCanvas": {
        zposition   : "front"
     },
     "searchfield" : {
     "placeholder" : 'Pretraga'
    },
    "navbar" : {
            title : 'Liskina Bašta'
     "placeholder" : '?'
    },
    "navbar" : {
            title : 'Liskina bašta'
          },
     "navbars": [
        {
           "position": "top",
           "content": [
             '<a href="/"><img src="/images/slike/liskina.png" class="img-responsive" alt="Image"></a>'
           ]
        },
        {
          "position"  : 'top',
          "content"   : [ 'searchfield' ]
        }, {
          "position"  : 'top',
          "content"   : [ 'breadcrumbs' ]
        },
        {
           "position": "bottom",
           "content": [
              "<a class='fa fa-envelope' href='#/'></a>",
              "<a class='fa fa-twitter' href='#/'></a>",
              "<a class='fa fa-facebook' href='#/'></a>"
           ]
        }
     ]
  });
});