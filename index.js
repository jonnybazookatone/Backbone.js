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
        'click .edit': 'edit',
        'click .delete': 'delete'
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
        var weight = new Weight({ time: $('#weight-date').val(), value: $('#weight-value').val()} );
        console.log($('weight-date').val())
        weights.add(weight);
        console.log(weight.toJSON());
        return false;
    });

    var appView = new WeightsView();
});