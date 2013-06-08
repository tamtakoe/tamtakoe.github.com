/** ===========================================================
 * livelist.js v0.9
 * http://github.com/tamtakoe/livelist
 * ========================================================== */

!function ($) {

  "use strict"; // jshint ;_;


 /* LIVELIST PUBLIC CLASS DEFINITION
  * =============================== */

  var Livelist = function (element, options) {
    this.init('livelist', element, options)
  }

  Livelist.prototype = {

    constructor: Livelist

  , init: function (type, element, options) {
	  var a = this
      this.type = type
      this.$element = $(element)
	  this.recordInputData($.fn.livelist.defaults, this.$element)
	  this.template = this.$element.html()
	  this.$element.empty()

	  this.$element.on( 'keyup', 'input.linegen', function(){
	    a.checkLastItem()
	  })
	  
	  this.$element.on( 'click', '.close', function(e){
		a.delItem($(e.target).parent())
	  })
	  
	  this.makeList(options)	  
	  this.addItem()	  
    }
  
  , editItem: function ($item, options) {
      var $linegen = $item.find('input.linegen')
	  var $closebtn = $item.find('.close')
      for (var k in options) if (options[k] === 'default') options[k] = $.fn.livelist.defaults[k]
	  $item.data().itemOptions = $.extend({}, $item.data('itemOptions'), options)
	    
	  var $datum = $item.find('[data-ll]')
	  $.each(options, function(k, v) {
		var $data = $datum.filter('[data-ll='+ k +']')	
		switch (k) {
			case 'editable': 
				if (v === true) {
					$linegen.removeAttr('disabled')
					$item.find('.dropdown-pills').removeAttr('disabled')
				} else {
					$linegen.attr('disabled','disabled')
					$item.find('.dropdown-pills').attr('disabled','disabled')
				}
				break
			case 'deletable': v === true ? $closebtn.show() : $closebtn.hide(); break
			case 'sortable': v === true ? $item.addClass('sortable') : $item.removeClass('sortable'); break
			default:
				switch ($data[0].tagName) {
					case 'INPUT': $data.val(v)
						if ($data.filter('[type="checkbox"]').length) v == 'on' ? $data.attr('checked','checked') : $data.removeAttr('checked')
						break
					case 'TEXTAREA': $data.html(v); break
					default: $data.attr('value', v)
				}
		}
	  })
  }
  
  , recordInputData: function (destination, $item) {
  	  $item.find('[data-ll]').each(function() {
		var $this = $(this)
		var optionName = $this.attr('data-ll')
		switch ($this[0].tagName) {
			case 'INPUT': destination[optionName] = $this.val(); break
			case 'TEXTAREA': destination[optionName] = $this.html(''); break
			default: destination[optionName] = $this.attr('value')
		}
	  })
  }
  
  , checkLastItem: function () {
      var $lastitem = this.$element.children().eq(-1)
	  if ($lastitem.find('input.linegen').val() !== '') {
		this.editItem($lastitem, {sortable:'default', deletable:'default'})
		this.addItem()
	  } else if ($lastitem.prev().find('input.linegen').val() === '' && $lastitem.prev().data('itemOptions').deletable !== false) {
		this.editItem($lastitem.prev(), {sortable:false, deletable:false})
		this.delItem($lastitem)
	  }
  }
	
  , makeList: function (options) {
      this.$list = $([]);
	  for (var i=0; i<options.length; i++) {	  
		  var $item = $(this.template)
		  var itemoptions = $.extend({}, $.fn.livelist.defaults, options[i])
		  this.editItem($item, itemoptions)
		  this.$list = this.$list.add($item);	  
	  }
	  this.$list.appendTo(this.$element)
  }
  
  , addItem: function (options) {
  	  options = options || {sortable:false, deletable:false}
	  var $item = $(this.template)
	  var itemoptions = $.extend({}, $.fn.livelist.defaults, options)
	  this.editItem($item, itemoptions)
	  $item.appendTo(this.$element)
    }
	
  , delItem: function ($item) {
	  $item.remove()
    }
	
  , save: function () {
      var a = this
	  var data = []
	  var datalength = this.$element.children().length-1
      this.$element.children().each(function(i) {
		if (i < datalength) a.recordInputData(data[i] = {}, $(this))
	  })
	  return JSON.stringify(data)
    }

  }


 /* LIVELIST PLUGIN DEFINITION
  * ========================= */

  $.fn.livelist = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('livelist')
        , options = typeof option == 'object' && option
      if (!data) $this.data('livelist', (data = new Livelist(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.livelist.Constructor = Livelist

  $.fn.livelist.defaults = {
    sortable: true
  , editable: true
  , deletable: true
  }

}(window.jQuery);