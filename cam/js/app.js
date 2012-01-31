// namespace
var exp = {
  controller: {},
  views: {}
};

jQuery(function($) {
  exp.views.HomeView = exp.controller.ApplicationController.create({
    elements: {
      '#home': 'home',
      '#alert': 'alert',
      '#video': 'videoSection',
      '> section': 'sections',
      '#nav-sections': 'nav',
      '#roll': 'roll',
      '#blur': 'blur',
      '#hue': 'hue',
      '#sat': 'sat',
      '#noise': 'noise',
      '#filters': 'filters',
      '#filter-trigger': 'filter-trigger'
    },
    
    events: {
      'click .horizontal-lnk': 'horizontal',
      'change #blur': 'blurring',
      'change #hue, #sat': 'hueSat',
      'change #noise': 'noisey',
      'click #filter-trigger': 'filters'
    },
    
    //==================================================
    // PUBLIC METHODS
    //==================================================
    
    /**
     * Initialize the homeview. Overwrites the application
     * controller.
     */
    init: function() {

      this.video = document.createElement('video');
      this.video.autoplay = true;
      this.blurVal = 0;
      this.hueVal = 0;
      this.satVal = 0;
      this.noiseVal = 0;
      this.recorder;

      // call resize so that the video is fullsized.
      this.win = $(window);
      this.resize();

      try {
        this.output = fx.canvas();
        this.videoSection.append(this.output);
      } catch (e) {
        console.log(e);
        return;
      }

      this.snappy = document.getElementById('snappy');
      this.displayCanvas = document.getElementById('display');
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      this.getMedia();

      /**
       * events
       */
      this.win.on('resize', $.proxy(this.resize, this));
      $(document).bind('keydown', 
        $.proxy(this.registerKeyboardEvents, this));
    },

    /**
     * Register keyboard events
     */
    registerKeyboardEvents: function(e) {
      switch(e.keyCode) {
        case 37: // left arrow
          console.log('left');
          break;
        case 39: // right arrow
          console.log('right');
          break;
        default: 
          break;
      }
    },
    
    // NOT IMPLEMENTED YET.
    // record: function() {
    //   this.recorder = this.mediastream.record();
    // },
    // 
    // stop: function() {
    //   
    //   this.mediastream.stop();
    //   this.recorder.getRecordedData(function(blob) {
    //       // Upload blob using XHR2.
    //       console.log(blob);
    //     });
    //   
    // },
    
    filters: function() {
      this.filters.toggleClass('in');
    },
    
    blurring: function() {
      this.blurVal = this.blur.val();
    },
    
    noisey: function() {
      this.noiseVal = this.noise.val() / 100;
    },
    
    hueSat: function() {
      this.hueVal = this.hue.val() / 100;
      this.satVal = this.sat.val() / 100;
    },
    
    resize: function(e) {
      var width = this.win.width();
      var height = this.win.height();
      if (e) {
        e.preventDefault();
      }
      this.video.width = width;
      this.video.height = height;
    },
    
    horizontal: function(e) {
      e.preventDefault();
      var target = $(e.currentTarget.hash);
      target.toggleClass('in');
    },
    
    getMedia: function() {
      var self = this;
      if (navigator.getUserMedia) {
        this.alert.hide();

        if (window.webkitURL) {
          navigator.getUserMedia('video', $.proxy(function(stream) {
            // Replace the source of the video element with the stream from the camera
            this.video.src = window.webkitURL.createObjectURL(stream);
            this.mediastream = stream;
          }, this), errorCallback);
        } else {
          navigator.getUserMedia({video: true}, $.proxy(function(stream) {
            // Replace the source of the video element with the stream from the camera
            this.video.src = stream;
            this.mediastream = stream;
          }, this), errorCallback);
        }

        function errorCallback(error) {
          this.alert.text('Oooooops. Whatta bummer');
          this.alert.show();
          return;
        }
        
        setInterval(function() {
          self.draw();
        }, 100);
        
        setInterval(function() {
          self.snapshot();
        }, 10000);
        
        // Prepare the audio file, depending on browser support
        // audio = new Audio();
        // audiotype = getAudioType(audio);
        // if (audiotype) {
        //   audio.src = 'polaroid.' + audiotype;
        // }
      } else {
          this.alert.text('Native web camera streaming (getUserMedia) is not supported in this browser.');
          this.alert.show();
          return;
      }
    },
    
    draw: function() {
      var frame = this.output.texture(this.video);
      this.output.draw(frame).noise(this.noiseVal).triangleBlur(this.blurVal).hueSaturation(this.hueVal, this.satVal).update();
    },
    
    mousemove: function(e) {
      if(this.blurVal >= 0) {
        this.blurVal = this.blurVal - 1;
      }
    },
    
    mouseout: function(e) {
      if(this.blurVal >= 50) {
        clearTimeout(this.timer);
      } else {
        this.blurVal = this.blurVal + 1;
        this.timer = setTimeout($.proxy(this.mouseout, this), 100);
      }
    },
    
    snapshot: function(e) {
      if(e) {
        //e.preventDefault();
      }
      var video = this.video[0];
      var img;
      var li;

      li = $('<li>');

      // Create an image element with the canvas image data
      img = $('<img>', {
        'src': this.output.toDataURL("image/png")
      });
      
      li.append(img);
      
      // Add the new image to the film roll
      this.roll.append(li);
    }
    
  });
  
  var homeView = new exp.views.HomeView({el: $('body')});
});

