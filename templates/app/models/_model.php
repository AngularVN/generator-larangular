<?php

class <%= _.classify(name) %> extends Eloquent {
	protected $fillable = [];
    protected $table = "<%= pluralize(name) %>";
    public $timestamps = false;

    // need to explicitly cast attributes of type Integer, Float, Boolean
    <% _.each(attrs, function (attr) {
        var belongs = attr.attrName.split("_").shift();
        if ("id" == attr.attrName.split("_").pop()){ %>
    public function <%= belongs.toLowerCase() %>(){
        return $this->belongsTo("<%= _.capitalize(belongs) %>");
    }
    <%  }
    if (attr.attrType == 'Integer' || attr.attrType == 'Float' || attr.attrType == 'Boolean') { %>

    public function get<%= _.capitalize(attr.attrName).replace(" ", "_") %>Attribute($value)
    {
        return (<%= attr.attrType.toLowerCase() %>) $value;
    }
    <% } %>
    <% }); %>
}