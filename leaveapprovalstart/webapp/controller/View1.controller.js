sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox"

	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";
        var oController;
        var orderBusyDialog;

		return Controller.extend("namespace.leaveapprovalstart.controller.View1", {
			onInit: function () {
                  oController = this;
                var workflowModel = new sap.ui.model.json.JSONModel();
                workflowModel.loadData("/namespaceleaveapprovalstart/model/leavedetails.json", null, false);
                oController.getView().setModel(workflowModel);

            },



            onStartPress: function (oEvent) {


                orderBusyDialog = new sap.m.BusyDialog();

                var startContext = oController.getView().getModel().oData;
                var workflowStartPayload = {definitionId: "leaveapproval", context: startContext}                
                // var check=JSON.stringify(startContext);
                // console.log(check);
                orderBusyDialog.open();
                

                  // @ts-ignore
                  $.ajax({
                    url: "/namespaceleaveapprovalstart/bpmworkflowruntime/v1/xsrf-token",
                    method: "GET",
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    success: function (result, xhr, data) {
                        var token = data.getResponseHeader("X-CSRF-Token");
                        if (token === null) return;
 
                        // Start workflow 
                        // @ts-ignore
                        $.ajax({
                            url: "/namespaceleaveapprovalstart/bpmworkflowruntime/v1/workflow-instances",
                            type: "POST",
                            data: JSON.stringify(workflowStartPayload),
                             headers: {
                                "X-CSRF-Token": token,
                                "Content-Type": "application/json"
                            },
                            async: false,
                            success: function (data) {
                                orderBusyDialog.close();
                                sap.m.MessageBox.information("The workflow is started");
                            },
                            error: function (data) {
                                orderBusyDialog.close();
                                sap.m.MessageBox.information("The error occured");

                            }
                        });
                    }
                });
            }
		});
	});
