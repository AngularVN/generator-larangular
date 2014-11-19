<?php

Route::get('/', function()
{
	return View::make('index');
});

Route::group(array('prefix' => '<%= baseName %>'), function()
{
    <% _.each(entities, function (entity) { %>Route::resource('<%= pluralize(entity.name) %>', '<%= _.classify(entity.name) %>Controller');
<%}); %>
});