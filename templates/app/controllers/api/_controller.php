<?php

use Swagger\Annotations as SWG;
/**
 * @SWG\Resource(
 *   apiVersion="1.0.0",
 *   swaggerVersion="1.2",
 *   basePath="<%= baseURL %><%= baseName %>",
 *   resourcePath="/<%= pluralize(name) %>",
 *   description="Operations about <%= name %>",
 *   produces="['application/json']"
 * )
 */
class <%= _.classify(name) %>Controller extends BaseController {

	/**
	 * @SWG\Api(
	 *   path="/<%= pluralize(name) %>",
	 *   @SWG\Operation(
	 *      method="GET",
	 *      summary="List all <%= pluralize(name) %>",
	 *      notes="",
	 *      type="void",
	 *      nickname="create<%= _.classify(name) %>",
	 *      @SWG\ResponseMessage(code=400, message="Invalid request params"),
	 *      @SWG\ResponseMessage(code=401, message="Caller is not authenticated"),
	 *      @SWG\ResponseMessage(code=404, message="Resource not found")
	 *   )
	 * )
	 */
	public function index()
	{
		$<%= pluralize(name) %> = <%= _.classify(name) %>::all();
		return Response::json($<%= pluralize(name) %>->toArray());
	}


	/**
	 * @SWG\Api(
	 *   path="/<%= pluralize(name) %>/show/{id}",
	 *   @SWG\Operation(
	 *      method="GET",
	 *      summary="View a <%= pluralize(name) %> order by ID",
	 *      notes="",
	 *      type="void",
	 *      nickname="show<%= _.classify(name) %>",
	 *      @SWG\Parameter(name="id", description="ID of the order that needs to be show", required=true, type="int64", paramType="path", allowMultiple=false),
	 *      @SWG\ResponseMessage(code=400, message="Invalid request params"),
	 *      @SWG\ResponseMessage(code=401, message="Caller is not authenticated"),
	 *      @SWG\ResponseMessage(code=404, message="Resource not found")
	 *   )
	 * )
	 */	
	public function show($id)
	{
		$<%= name %> = <%= _.classify(name) %>::find($id);
		if (is_null($<%= name %>)) {
			return Response::json(array(), 404);
		}
		return Response::json($<%= name %>->toArray());
	}

	/**
	 * @SWG\Api(
	 *   path="/<%= pluralize(name) %>",
	 *   @SWG\Operation(
	 *      notes="",
	 *      method="PUT",
	 *      authorizations={},
	 *      summary="Create <%= pluralize(name) %> order by ID",
	 *      type="<%= _.classify(name) %>",
	 *      nickname="create<%= _.classify(name) %>",
	 *      @SWG\Consumes("application/json"),<% _.each(attrs, function (attr) {%>
	 *      @SWG\Parameter(name="<%= _.underscored(attr.attrName) %>", description="<%= attr.attrName %>", required=<%= (attr.required == "required") %>, type="string", paramType="path", allowMultiple=false),<% });%>
	 *      @SWG\ResponseMessage(code=400, message="Invalid request params"),
	 *      @SWG\ResponseMessage(code=401, message="Caller is not authenticated"),
	 *   )
	 * )
	 */
	public function store()
	{
		try {
			$response = [];
			$statusCode = 200;
			$body = file_get_contents('php://input');
			$request = json_decode($body, true);
			
			$errors = array();
			$validator = Validator::make(
				$request,
				array(<% _.each(attrs, function (attr) {
						if (attr.required||attr.minLength||attr.maxLength||attr.min||attr.max) {
							var validator="required"; 
							if (attr.attrType === "String") {
								if (attr.minLength){validator += "|min:"+attr.minLength;}
								if (attr.maxLength){validator += "|max:"+attr.maxLength;}    
							} else if (attr.attrType === "Boolean"){
								validator += "|boolean";
							} else if (attr.attrType === "Date"){
								validator += "|date_format:Y-m-d";
							} else if (attr.attrType === "Enum"){
								validator += "|in:"+attr.enumValues;
							} else if (attr.attrType === "Integer"){
								validator += "|numeric";
								if (attr.min){validator += "|min:"+attr.min;}
								if (attr.max){validator += "|max:"+attr.max;} 
							} else if (attr.attrType === "Float"){
								validator += "|regex:/^[+-]?\d+\.\d+, ?[+-]?\d+\.\d+$/";
							}%>
					"<%= _.underscored(attr.attrName) %>" => "<%= validator %>",<% }}); %>
				)
			);
			if ($validator->fails()) $errors = array_merge($errors, $validator->messages()->all('<li>:message</li>'));
			if (count($errors) == 0) {
				$<%= name %> = new <%= _.classify(name) %>;
				<% _.each(attrs, function (attr) { %>
				$<%= name%>-><%= _.underscored(attr.attrName) %> = isset($request['<%= _.underscored(attr.attrName) %>'])?$request['<%= _.underscored(attr.attrName) %>']:$<%= name%>-><%= _.underscored(attr.attrName) %>;<% }); %>
				$<%= name %>->save();
				$response = $<%= name %>->toArray();
			} else $statusCode = 400;
		//
		} catch (Exception $e) {
			$statusCode = 400;
			$response = array('X-Status-Reason', $e->getMessage());
		} finally {
      		return Response::json($response, $statusCode);
  		}
    }


	/**
	 * @SWG\Api(
	 *   path="/<%= pluralize(name) %>/update/{id}",
	 *   @SWG\Operation(
	 *      notes="",
	 *      method="PUT",
	 *      authorizations={},
	 *      summary="Update <%= pluralize(name) %> order by ID",
	 *      type="<%= _.classify(name) %>",
	 *      nickname="update<%= _.classify(name) %>",
	 *      @SWG\Consumes("application/json"),
	 *      @SWG\Parameter(name="id", description="ID of the order that needs to be update", required=true, type="int64", paramType="path", allowMultiple=false),<% _.each(attrs, function (attr) {%>
	 *      @SWG\Parameter(name="<%= _.underscored(attr.attrName) %>", description="<%= attr.attrName %>", required=<%= (attr.required == "required") %>, type="string", paramType="path", allowMultiple=false),<% });%>
	 *      @SWG\ResponseMessage(code=400, message="Invalid request params"),
	 *      @SWG\ResponseMessage(code=401, message="Caller is not authenticated"),
	 *      @SWG\ResponseMessage(code=404, message="Resource not found")
	 *   )
	 * )
	 */	
	public function update($id)
	{
		try {
			$response = [];
			$statusCode = 200;
			$body = file_get_contents('php://input');
			$request = json_decode($body, true);
			$<%= name %> = <%= _.classify(name) %>::find($id);
			if (!is_null($<%= name %>)) {
				$errors = array();
				$validator = Validator::make(
					$request,
					array(<% _.each(attrs, function (attr) {
							if (attr.required||attr.minLength||attr.maxLength||attr.min||attr.max) {
								var validator="required"; 
								if (attr.attrType === "String") {
									if (attr.minLength){validator += "|min:"+attr.minLength;}
									if (attr.maxLength){validator += "|max:"+attr.maxLength;}    
								} else if (attr.attrType === "Boolean"){
									validator += "|boolean";
								} else if (attr.attrType === "Date"){
									validator += "|date_format:Y-m-d";
								} else if (attr.attrType === "Enum"){
									validator += "|in:"+attr.enumValues;
								} else if (attr.attrType === "Integer"){
									validator += "|numeric";
									if (attr.min){validator += "|min:"+attr.min;}
									if (attr.max){validator += "|max:"+attr.max;} 
								} else if (attr.attrType === "Float"){
									validator += "|regex:/^[+-]?\d+\.\d+, ?[+-]?\d+\.\d+$/";
								}%>
						"<%= _.underscored(attr.attrName) %>" => "<%= validator %>",<% }}); %>
					)
				);
				if ($validator->fails()) $errors = array_merge($errors, $validator->messages()->all('<li>:message</li>'));
				if (count($errors) == 0) {
					<% _.each(attrs, function (attr) { %>
					$<%= name%>-><%= _.underscored(attr.attrName) %> = isset($request['<%= _.underscored(attr.attrName) %>'])?$request['<%= _.underscored(attr.attrName) %>']:$<%= name%>-><%= _.underscored(attr.attrName) %>;<% }); %>
					$<%= name %>->save();
					$response = $<%= name %>->toArray();
				} else $statusCode = 400;
			} else $statusCode = 404;
		//
		} catch (Exception $e) {
			$statusCode = 400;
			$response = array('X-Status-Reason', $e->getMessage());
		} finally {
      		return Response::json($response, $statusCode);
  		}
    }


	/**
	 * @SWG\Api(
	 *   path="/<%= pluralize(name) %>/{id}",
	 *   @SWG\Operation(
	 *      method="DELETE",
	 *      summary="Delete a <%= pluralize(name) %> order by ID",
	 *      notes="",
	 *      type="void",
	 *      nickname="delete<%= _.classify(name) %>",
	 *      @SWG\Parameter(name="id", description="ID of the order that needs to be deleted", required=true, type="int64", paramType="path", allowMultiple=false),
	 *      @SWG\ResponseMessage(code=400, message="Invalid request params"),
	 *      @SWG\ResponseMessage(code=401, message="Caller is not authenticated"),
	 *      @SWG\ResponseMessage(code=404, message="Resource not found")
	 *   )
	 * )
	 */
	public function destroy($id)
	{
		try {
			$response = [];
			$statusCode = 200;
			$<%= name %> = <%= _.classify(name) %>::find($id);
			if (is_null($<%= name %>)) {
				$statusCode = 404;
			}
			$<%= name %>->delete();
			$statusCode = 204;
		} catch (Exception $e) {
			$statusCode = 400;
			$response = array('X-Status-Reason', $e->getMessage());
		} finally {
      		return Response::json($response, $statusCode);
  		}
    }
}