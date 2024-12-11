# Setting Up a Serverless Angular Project

This guide will help you set up a serverless application with an Angular frontend and a serverless backend hosted on AWS using AWS Lambda and DynamoDB.

## Prerequisites

Before you start, first ensure you have the following:

- **AWS Account**: Create an account on [AWS](https://aws.amazon.com/) if you don’t have one.
- **AWS CLI**: Install and configure the AWS Command Line Interface with your account details. Instructions can be found [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html).
- **Node.js and npm**: Install Node.js and npm from [here](https://nodejs.org/).
- **Angular CLI**: Install the Angular Command Line Interface. Instructions are available [here](https://angular.dev/tools/cli).

## Inital Setup

### Step 1: Setup the Repository

Download the project repository created for your class to your local machine if not already done.

- Command: `git clone https://github.com/ucmo-cs/Senior_Project_Team_Name.git`

Download this base project repo.

- Command: `git clone https://github.com/risen-one-technologies/senior-project-template.git`

Copy the contents to your project folder and push them to your repo.

- Command: `cp LICENSE /path/to/your/Senior_Project_Team_Name`
- Command: `cp README.md /path/to/your/Senior_Project_Team_Name`
- Command: `cp -r backend/ /path/to/your/Senior_Project_Team_Name`
- Command: `cp -r frontend/ /path/to/your/Senior_Project_Team_Name`
- Command: `cd /path/to/your/Senior_Project_Team_Name`
- Command: `git add .`
- Command: `git commit -m "Initial commit"`

## Backend Setup

### Step 1: Navigate to the backend folder

Navigate to the backend folder.

- Command: `cd backend`

### Step 2: Install Serverless Framework

Install the Serverless Framework, which will help you manage the serverless backend.

- Command: `npm install -g serverless`

### Step 3: Install Project Dependencies

Install the necessary dependencies.

- Command: `npm install`

### Step 4: Configure Serverless Framework

1. Open the `serverless.yml` file in the backend directory.
2. Update the file with your AWS account details and configure the DynamoDB table if needed.
3. Ensure the table name in `serverless.yml` matches the table name used in your Lambda functions.

### Step 5: Deploy the Backend

Deploy the serverless application to AWS. This will set up the necessary AWS Lambda functions and DynamoDB tables.

- Command: `serverless deploy`

After deployment, note the API endpoints provided by the Serverless Framework.

### Step 6: Set Up Login Functionality

Follow these steps to configure the login functionality:

1. **Create the DynamoDB Table**:
   - The table is created with the name `users` and it has `username` as the primary key. This is defined in the `resources` section of the `serverless.yml` file.

2. **Add Users to the Table**:
   - Sample users are added to the DynamoDB table with predefined usernames and passwords. This ensures that you have users to test the login functionality.

3. **Lambda Function for Login**:
   - The Lambda function defined in `src/handlers/login.js` handles the login requests. It checks if the provided username and password match an existing user in the DynamoDB table.

### Lambda Function Code Explanation:

The Lambda function is responsible for handling login requests. Here's a breakdown of the code in [login.js](./backend/src/handlers/login.js):
- The function uses the AWS SDK to interact with DynamoDB.
- It reads the username and password from the request body.
- It retrieves the user from the DynamoDB table using the username.
- It checks if the user exists and if the password matches.
- It returns a success message if the login is successful or an error message if the login fails.
  
## Frontend Setup

### Step 1: Navigate to the frontend folder

Navigate to the frontend folder

- Command: `cd ../frontend`

### Step 2: Install Angular Project Dependencies

Navigate to the frontend directory of the project and install the necessary dependencies.

- Command: `npm install`

### Step 3: Develop and Build the Frontend

#### Run the Development Server

Start the development server to preview the Angular application locally.

- Command: `ng serve`

#### Build the Project

Build the project to prepare it for deployment. The build artifacts will be stored in the `dist/frontend` directory.

- Command: `ng build --prod`

### Step 4: Deploy the Frontend

#### Configure Backend Integration

Ensure that the build output directory (`dist/frontend`) is correctly set up in the backend serverless configuration. Refer to the backend README for more details on deploying the frontend with the backend.

#### Deploy to AWS S3

1. Create an S3 Bucket

Go to the AWS Management Console and navigate to the S3 service. Create a new bucket for your frontend files.

2. Upload Build Artifacts

After building the Angular project, upload the contents of the `dist/frontend` directory to the S3 bucket.

3. Configure Bucket Permissions

Set the appropriate permissions for the S3 bucket to allow public access to the files.

4. Enable Static Website Hosting

Enable static website hosting for the S3 bucket.

### Accessing Your Application

After deploying the frontend to S3 and setting up the backend on AWS, you can access your application through the S3 bucket URL provided in the static website hosting settings.

## Additional Resources

- [Serverless Framework Documentation](https://www.serverless.com/framework/docs)
- [AWS SDK for JavaScript Documentation](https://docs.aws.amazon.com/sdk-for-javascript/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [Angular CLI Documentation](https://angular.io/cli)
- [Angular Documentation](https://angular.io/docs)

Following these steps will help you set up and deploy a serverless Angular application with a backend hosted on AWS. If you encounter any issues, refer to the additional resources provided for detailed documentation.

***********************************************************************************

All of these steps above were to get the initial setup done. This project 
consisted of a team of 3: 1 frontend, 1 backend and 1 that helped with both. I 
was responsible for the frontend portion of the project. My tasks going into 
the project consisted of:

* Developing the UI first, such as the basic layout like HTML and CSS
	* For the HTML: 
		* Segregate everything into seperate div's and build on top of 
		eachother 
		* Create one big box and display everything inside (i.e. the 
		dropdowns and the timesheet itself)
		* Populate the original box with 3 others. These consisted of 
			* Box 1: Project Name, Select Month and Select Year
				* Each consisting of a dropdown menu for their 
				desired output 
			* Box 2: The timesheet itself
				* Consisting of the employees, the number of 
				days pertained to that specific month and a 
				total column  
			* Box 3: Manager Signature and Date
				* Manager Signature is a textfield that the 
				manager signs with text
				* Date uses a Date library in which you can 
				use any date, however it automatically is 
				preselected as todays date 
		* Under Box 1: Export to PDF, Edit and Save
		
	* For the CSS:
		* The CSS for this project is designed to deliver a clean, 
		professional and user-friendly interface. The goal was to 
		create a visually appealing layout while maintaining 
		functionality and readability for the timesheet application.
		Below are the key features of the CSS styling: 

			* Color Scheme: a yellow-orange background provided by 
			Risen One as a preset color scheme 
			* Button such as Export, Edit and Save are styled with 
			bold yelloq-orange borders and a white fill to make 
			them prominent and visually distinguishable 
			
			* Typography: Fonts were provided by Risen One, but 
			were chosen to ensure readability, with a focus on clean, 
			simple text for both headers and tabular data 
			
			* Grid Layout: The timesheet uses a grid/table 
			structure to organize employee hours clearly. 
			Alternating rows and columns ensure data alignment and
			easy navigation for the user
			* The Total columnn is highlighted with a bold black 
			and white text to emphasize summary data 

			* Input Elements: Dropdown menus and date pickers are 
			styled for consistent sizing and alignment within the 
			form, ensuring seamless interaction for selecting project 
			names, months, and years.
			
			*The manager signature box and date fields are styled 
			with borders for a minimal yet functional look.	

			* Custom Buttons: Buttons such as "Save," "Edit," and 
			"Export" are designed with hover effects to provide 
			feedback and improve the user experience.
			* Class-based styling ensures reusability and consistency 
			across all button components 

			* Alignment and Spacing: Proper padding and margin settings 
			provide enough space between components, ensuring a
			 clutter-free layout.
			* Elements like the project name, month, and year dropdowns
			 are aligned horizontally to give a polished form structure.

		
		For the Typescript:

			* Dropdown Management: Handles the selection of the 
			Project Name, Month and Year from the dropdown menus
			*Ensures that timesheet data updates dynamically based 
			on the selected month and project 

			Data Binding and Two-Way Interaction: Uses Angular's 
			two-way binding to connect the UI with the 
			applications data model

			*Timesheet Functionality: 
				* Save Timesheet: Implements the 
				saveTimesheet() method to save the current 
				state od the timesheet
				* Ensures the data persists and is correctly
				associated with the selected projects, month 
				and year 
				
				* Edit Timesheet: Allows users to toggle
				between view-only and editable modes for 
				the timesheet 
				* Integrates validation logic to ensure that 
				only valid data can be entered into the 
				timesheet fields 

				* Export to PDF: Provides functionality for 
				users to download the timesheet as a PDF file,
				ensuring it's formatted and ready for 
				submission or archival 
				
				* Dynamic Totals Calculations: Calculates
				the daily totals for each employee as well as 
				the grannd total across all employees 
				* Updates the totals row at the bottom 	
				dynamically whenever any input field in the 
				grid is modified
		
			
			* API Intgration:
				* Backend Communication: Connects with a REST 
				API to fetch, update and sace timesheet data 
				for different projects and months 
				* Ensures the application maintains data 
				integrity and synchronizes updates with 
				the backend 

				Error Handling: Includes robust error-handling 
				mechanisms to manage API failuers and provide 
				meanigful feedback to the user (error 
				messages)
			
			* Validation and Logic:Input Validation:

				* Validates that user inputs (e.g., hours worked) 
				are numerical, non-negative, and within logical limits.
				* Date and Signature Validation:Ensures the manager's 
				signature and submission date are entered before saving 
				the timesheet.
				* State Management: Maintains a clear separation 
				of concerns by using variables and TypeScript 
				objects to manage the current state of the UI, timesheet 
				data, and API responses.

			*  Scalability and Maintainability: 
				* Reusable Components: Breaks down the application into 
				modular and reusable Angular components, making the 
				codebase easier to maintain and scale.
				* Event Handling: Uses clean event-binding techniques 
				to manage user actions like clicks on "Save," "Edit," 
				and dropdown selections.
				Other Noteworthy Features
				* Real-Time Feedback: Provides immediate feedback to 
				users as they interact with the application, such as 
				updated totals or validation messages.


	* Challenges in the Project: 
		* API Connection: Throughout the making of this project our main 
		focus was on developing the UI. This backfired on us as we then 
		transitioned our focus onto the API connection. We ran into issues
		with the save button as it was not persistant in keeping the data 
		that was already uploaded (the amount of hours that the 
		employees worked).
		* CSS: Responsiveness was a big issue and still is, even though
		it was not required, we tried adding responsiveness by wrapping 
		the CSS in a media wrapping, however when doing so a lot of code
		started to break, so we then stuck with our original plan on just 
		making it for computers. 
		Typescript: The Save function was a huge task to tackle as it 
		required a backend API call and it took all of our minds to 
		finally get the API to work with the lambda functions that 
		were integrated into the backend   


	* What I learned: Even though this project was tough, it came with a huge
	positive, which is a learning experience. I learned more about Typescript 
	and the connectivity between the frontend and the backend of application. 
	Along with the Typescript, I also learned more about CSS. To be specific 
	I learned more about the basic components such as: padding, shadow boxes,
	width, height, border radius and other basic functions. Overall this 
	project was a great learing experience and allowed me to grow and learn
	as a developer  
