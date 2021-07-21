/*
Copyright (c) 2021 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*/

const xapi = require('xapi');

const VIDEO_MATRIX_LAYOUT = {
    PROMINENT: "Prominent",
    EQUAL: "Equal"
};
const VIDEO_MATRIX_MODE = {
    ADD: "Add",
    REPLACE: "REPLACE"
};
const PRIMARY_OUTPUT_CONNECTOR = 1;
const SECONDARY_OUTPUT_CONNECTOR = 2;
const LOCAL_VIDEO = 1; // refers to video sourceId
const REMOTE_VIDEO = 1; // refers to remote main sourceId

// Change display screen
function setMonitorRole(connector, role) {
    xapi.config.set(`Video Output Connector ${connector} MonitorRole`, role);
}

// Set video matrix
function setVideoMatrix(sourceId, output, layout, mode, remote_main){
    if(remote_main == null){
        xapi.Command.Video.Matrix.Assign({ Layout: layout, Mode: mode, Output: output, SourceId: sourceId});
    }else{
        xapi.Command.Video.Matrix.Assign({ Layout: layout, Mode: mode, Output: output, SourceId: sourceId, RemoteMain: remote_main});
    }
}

// Swap video matrix
function swapVideoMatrix(){
    xapi.Command.Video.Matrix.Swap({ OutputA: PRIMARY_OUTPUT_CONNECTOR, OutputB: SECONDARY_OUTPUT_CONNECTOR});
}

// Reset video matrix
function resetVideoMatrix(output){
    xapi.Command.Video.Matrix.Reset({ Output: output});
}

// Use Case 1: Call joined and before presentation starts
xapi.Event.CallSuccessful.on(value => {
    // Script: far end on primary and near end on secondary screen
    //setVideoMatrix(LOCAL_VIDEO, SECONDARY_OUTPUT_CONNECTOR, VIDEO_MATRIX_LAYOUT.PROMINENT, VIDEO_MATRIX_MODE.REPLACE, null);
});

xapi.Event.CallDisconnect.on(value => {
    //resetVideoMatrix(PRIMARY_OUTPUT_CONNECTOR);
    //resetVideoMatrix(SECONDARY_OUTPUT_CONNECTOR);
});

// Use Case 2: Presentation started and stopped
xapi.Event.PresentationStarted.on(value => {
    // Script: presentation on primary screen, far end and near end video on secondary screen

});

xapi.Event.PresentationStopped.on(value => {
    // Script: restore use case 1 behavior

});


xapi.event.on('UserInterface Extensions Panel Clicked', (event) => {
    switch (event.PanelId)
    {
        case 'panel_layout_people':
            xapi.Command.Video.Layout.LayoutFamily.Set({ LayoutFamily: "Overlay", Target: "Local"});
            setMonitorRole(SECONDARY_OUTPUT_CONNECTOR, "Auto");
            break;
        case 'panel_layout_content':
            xapi.Command.Video.Layout.LayoutFamily.Set({ LayoutFamily: "Overlay", Target: "Local"});
            setMonitorRole(SECONDARY_OUTPUT_CONNECTOR, "PresentationOnly");
            break;
        case 'panel_layout_meeting':
            xapi.Command.Video.Layout.LayoutFamily.Set({ LayoutFamily: "Equal", Target: "Local"});
            setMonitorRole(SECONDARY_OUTPUT_CONNECTOR, "Auto");
            break;
    }
});