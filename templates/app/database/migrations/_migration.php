<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class Create<%= _.classify(name) %>Table extends Migration{
	public function up()
	{
		Schema::create('<%= pluralize(name) %>', function(Blueprint $table)
		{
			<% if (databaseType=='mysql') { %>$table->engine = 'InnoDB';<% } %>
			$table->increments('id')->unsigned();
			<% _.each(attrs, function (attr) { %>
			$table-><%
			if ((attr.attrType == 'Enum')||(attr.attrType == 'Password')||(attr.attrType == 'Email')) { %>string<% }
			else { %><%= attr.attrType.toLowerCase() %><% }
			%>('<%= attr.attrName.replace(" ", "_").toLowerCase() %>')<%
				if (attr.attrName != "Text") {
					if (attr.maxLength > 0) { %>->length('<%= attr.maxLength %>')<% }
					if (attr.attrName == "Integer") { %>->unsigned()<%}
				}
			%>;<%
			 var belongs = attr.attrName.split("_").shift();
			 if ("id" == attr.attrName.split("_").pop()){ %>
			//$table->foreign('<%= attr.attrName.replace(" ", "_").toLowerCase() %>')->references('id')->on('<%= pluralize(belongs) %>')->onDelete('cascade');
			<%  }
			}); %>
		});
	}

	/**
	 * Undo the migration
	 */
	public function down()
	{
		Schema::drop('<%= pluralize(name) %>');
	}
}