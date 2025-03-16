import requests

class Api:
    def __init__(self, token, base_url, slug):
        self.token = token
        self.base_url = base_url
        self.slug = slug

    def send_prompt(self, text):
        prompt = '''
        You are a health assistant designed to analyze body report files and provide a comprehensive health assessment. The input will be a text file containing a user's body report, including metrics such as blood pressure, cholesterol levels, blood sugar, BMI, and other relevant health data. Your task is to:

        1. **Score the Body Health Condition**:
        - Analyze the provided data and assign a health score out of 10, where 10 is excellent health and 1 is poor health.
        - Explain the rationale behind the score.

        2. **Identify Potential Health Problems**:
        - Based on the data, list any potential health issues or risks the user may face (e.g., high blood pressure, diabetes, obesity, etc.).
        - Provide a brief explanation of each identified issue.

        3. **Provide Recommendations**:
        - Suggest specific actions the user can take to improve their health (e.g., dietary changes, exercise routines, medical consultations, etc.).
        - Tailor the recommendations to address the identified health problems.

        4. **Suggest Lifestyle Changes**:
        - Recommend long-term lifestyle changes to maintain or improve health (e.g., stress management, sleep hygiene, quitting smoking, etc.).
        - Explain how these changes will benefit the user.
        ### **Input**:
        ''' + text + '''
        ### **Output Format**:
        Your response should follow this structure:

        1. **Health Score**: [Score out of 10]
        - **Rationale**: [Explanation of the score]

        2. **Potential Health Problems**:
        - [Issue 1]: [Explanation]
        - [Issue 2]: [Explanation]
        - [Issue 3]: [Explanation]

        3. **Recommendations**:
        - [Recommendation 1]
        - [Recommendation 2]
        - [Recommendation 3]

        4. **Lifestyle Changes**:
        - [Change 1]: [Explanation of benefits]
        - [Change 2]: [Explanation of benefits]
        - [Change 3]: [Explanation of benefits]

        ---

        ### **Example Output**:

        1. **Health Score**: 5/10
        - **Rationale**: The user has elevated blood pressure, high cholesterol, and a BMI indicating overweight. These factors contribute to a moderate health risk.

        2. **Potential Health Problems**:
        - **Hypertension**: Blood pressure is 140/90 mmHg, which is above the normal range and increases the risk of heart disease.
        - **High Cholesterol**: Cholesterol level is 220 mg/dL, which is high and can lead to atherosclerosis.
        - **Obesity**: BMI of 28.5 indicates overweight, which is associated with diabetes and joint problems.

        3. **Recommendations**:
        - Consult a doctor to manage blood pressure and cholesterol levels.
        - Start a balanced diet low in saturated fats and sodium.
        - Engage in moderate exercise for at least 30 minutes daily, 5 days a week.

        4. **Lifestyle Changes**:
        - **Quit Smoking**: Smoking increases the risk of cardiovascular diseases. Quitting will improve lung and heart health.
        - **Increase Sleep Duration**: Aim for 7-8 hours of sleep per night to improve overall well-being.
        - **Reduce Alcohol Consumption**: Limiting alcohol intake will help lower blood pressure and improve liver health.
        '''
        # sending a prompt to AnythingLLM
        url = self.base_url + f"/v1/workspace/{self.slug}/chat"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {
            "message": prompt,
            "mode": "chat"
        }
        try:
            response = requests.post(url, json=payload, headers=headers)
            return response.json()["textResponse"]
        except requests.exceptions.HTTPError as err:
            print(f"HTTP error occurred: {err}")
        except requests.exceptions.RequestException as err:
            print(f"An error occurred: {err}")

    def generate_overall_report(self, lab_reports):
        prompt = '''
        You are a health assistant designed to analyze a list of body reports and generate an overall health report. The input will be a list of strings, where each string represents a body report containing metrics such as blood pressure, cholesterol levels, blood sugar, BMI, and other relevant health data. Your task is to:

        1. **Analyze Each Report**:
        - Extract and summarize the key metrics from each body report.
        - Identify any abnormal values or health risks in each report.

        2. **Identify Trends Across Reports**:
        - Compare the metrics across all reports to identify trends (e.g., increasing blood pressure, improving cholesterol levels, etc.).
        - Highlight any consistent health issues or improvements.

        3. **Generate an Overall Health Score**:
        - Assign an overall health score out of 10, where 10 is excellent health and 1 is poor health.
        - Explain the rationale behind the score.

        4. **Provide Recommendations**:
        - Suggest specific actions to address the identified health risks.
        - Provide general recommendations for maintaining or improving health.

        5. **Suggest Lifestyle Changes**:
        - Recommend long-term lifestyle changes based on the trends and risks identified.
        - Explain how these changes will benefit the user.

        ---

        ### **Input**:\n
        '''
        counter = 1
        for lab_report in lab_reports:
            if lab_report:
                prompt += f"report {counter}: " + "analysis: " + lab_report.analysis + "\n" 
                + "lifestyle change suggestions: " + lab_report.lifestyle_change_suggestions + "\n" 
                + "medical recommendations: " + lab_report.medical_recommendations + "\n"
                counter += 1
        
        # sending a prompt to AnythingLLM
        url = self.base_url + f"/v1/workspace/{self.slug}/chat"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json"
        }
        payload = {
            "message": prompt,
            "mode": "chat"
        }
        try:
            response = requests.post(url, json=payload, headers=headers)
            return response.json()["textResponse"]
        except requests.exceptions.HTTPError as err:
            print(f"HTTP error occurred: {err}")
        except requests.exceptions.RequestException as err:
            print(f"An error occurred: {err}")