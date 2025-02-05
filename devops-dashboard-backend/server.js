require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "thoufeekx";
const REPO_NAME = "devops-example-project";

// Jenkins configuration
const JENKINS_URL = process.env.JENKINS_URL || 'http://localhost:8080'; // Base URL for Jenkins

// Fetch GitHub Actions Workflow Data
app.get("/api/workflows", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/runs`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    
    const workflows = response.data.workflow_runs.map(run => ({
      buildName: run.name || 'N/A', // Build name
      branch: run.head_branch || 'N/A', // Branch name
      startedTime: run.created_at, // Started time
      displayTitle: run.display_title || 'N/A', // Display title
      status: run.status || 'N/A', // Status
      conclusion: run.conclusion || 'N/A', // Conclusion
      url: run.html_url // URL to the workflow run
    }));
    
    res.json(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    res.status(500).json({ error: "Failed to fetch workflows" });
  }
});

// Fetch Jenkins Build Data for a specific job
app.get("/api/jenkins-builds", async (req, res) => {
  try {
    const jobName = 'DevOps-Dashboard-Pipeline'; // Specify the job name here
    const apiUrl = `${JENKINS_URL}/job/${jobName}/api/json?tree=builds[number,status,timestamp,result,duration,url]`;
    console.log('Calling Jenkins API URL:', apiUrl); // Log the API URL being called
    const response = await axios.get(apiUrl);
    
    console.log('Jenkins response:', response.data); // Log the response to check its structure
    
    const builds = response.data.builds.map(build => ({
      number: build.number,
      status: build.result || 'UNKNOWN',
      duration: build.duration || 0,
      timestamp: build.timestamp ? new Date(build.timestamp).toISOString() : null,
      url: build.url
    }));

    res.json(builds);
  } catch (error) {
    console.error("Error fetching Jenkins builds:", error);
    res.status(500).json({ error: "Failed to fetch Jenkins builds" });
  }
});

// Fetch specific Jenkins job details
app.get("/api/jenkins/job/:jobName", async (req, res) => {
  const { jobName } = req.params;
  try {
    const response = await axios.get(
      `${JENKINS_URL}/job/${jobName}/api/json?tree=builds[number,status,timestamp,result,duration,url]`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error(`Error fetching details for job ${jobName}:`, error);
    res.status(500).json({ error: `Failed to fetch details for job ${jobName}`, details: error.message });
  }
});

// GitHub Webhook for Real-Time Updates
app.post("/webhook", (req, res) => {
  const { action, workflow_run } = req.body;

  console.log(`Workflow ${workflow_run.name} is ${workflow_run.status}`);

  res.status(200).send("Webhook received");
});

app.listen(3001, () => console.log("Server running on port 3001"));
