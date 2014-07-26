// My model is a 'weight'
var Weight = Backbone.Model.extend({
    defaults: function(){
        return {
            time: '',    
            value: ''
        }
    }
});

// Create my collection of weights
var WeightList = Backbone.Collection.extend({
    model: Weight
});

var weights = new WeightList([
    new Weight({
        time: Date(),
        value: 86.6,
    })
]);

// View: turns weight list into HTML
var WeightView = Backbone.View.extend({
    model: new Weight(),
    tagName: "div",
    
    events: {
        'click .edit-time': 'edittime', // if they click edit text
        'click .edit-value': 'editvalue',
        'click .delete': 'delete',  // if they click delete text
        'blur .value': 'close', // if they click random place
        'keypress .value': 'onEnterUpdate', // if they press enter
        'keypress .time': 'onEnterUpdate' // if they press enter
    },

    edittime: function(ev) {
        console.log("click");
        ev.preventDefault();
        this.$('.time').attr('contenteditable',true).focus();
    },

    editvalue: function(ev) {
        console.log("click");
        ev.preventDefault();
        this.$('.value').attr('contenteditable',true).focus();
    },

    close: function(ev){
        var newTime = this.$('.time').text();
        var newWeight = this.$('.value').text();

        this.model.set('time', newTime);
        this.model.set('value', newWeight);

        this.$('.time').removeAttr('contenteditable');
        this.$('.value').removeAttr('contenteditable');
    },

    onEnterUpdate: function(ev){
        var self = this;
        console.log("ev.keyCode")
        if(ev.keyCode === 13) {
            this.close();
            _.delay(function() { self.$('.value').blur() }, 100);
            _.delay(function() { self.$('.time').blur() }, 100);
        };
    },

    delete: function(ev){
        ev.preventDefault();
        weights.remove(this.model);
    },

    initialize: function() {
        this.template = _.template($('#weight-template').html());
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var WeightsView = Backbone.View.extend({

    model: weights,
    el: $('#weight-container'),
    
    initialize: function(){
        this.model.on("add", this.render, this);
        this.model.on("remove", this.render, this);
    },

    render: function(){
        var self = this;
        self.$el.html('');
        _.each(this.model.toArray(), function(weight, i){
            console.log(weight)
            self.$el.append((new WeightView({model: weight})).render().$el);
        });
        return this;
    }
});

$(document).ready(function(){

    $('#new-weight').submit(function(event) {

        var parts = $('#weight-date').val().split('-');
        console.log(parts);
        var newDate = new Date(parts[0], parts[1]-1, parts[2]);

        var weight = new Weight({ time: newDate, value: $('#weight-value').val()} );
        console.log($('#weight-date').val())
        weights.add(weight);
        console.log(weight.toJSON());
        return false;
    });

    var appView = new WeightsView();
});