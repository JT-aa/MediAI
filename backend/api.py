import requests

class Api:
    def __init__(self, token, base_url, slug):
        self.token = token
        self.base_url = base_url
        self.slug = slug

    def send_prompt(self, text):
        print("Constructing prompt for AnythingLLM...")
        prompt = '''
        You are a health assistant designed to analyze lab report files and provide a comprehensive health assessment. The input will be a text file containing a user's body report, including metrics such as blood pressure, cholesterol levels, blood sugar, BMI, and other relevant health data. Your task is to:

        1. **Score the Body Health Condition**:
        - Analyze the provided data and assign a health score out of 100, where 100 is excellent health and 0 is poor health.
        - Explain the rationale behind the score.

        2. **Identify Potential Health Problems**:
        - Based on the data, list any potential health issues or risks the user may face (e.g., high blood pressure, diabetes, obesity, etc.).
        - Provide a brief explanation of each identified issue.

        3. **Provide Medical Recommendations**:
        - Suggest further labs or tests that the user should consider based on the identified health problems (e.g., fasting blood sugar, lipid profile, etc.).
        - Include any immediate actions the user should take (e.g., consult a doctor, start medication, etc.).

        4. **Suggest Lifestyle Changes**:
        - Recommend long-term lifestyle changes to maintain or improve health (e.g., stress management, sleep hygiene, quitting smoking, dietary change, exercise etc.).
        - Explain the benefits of each suggested change.
        ### **Input**:
        ''' + text + '''
        ### **Output Format**:
        Your response should be a pure json object with the following structure:
        
        {
            "health_score": {
                "score": 0-100,
                "rationale": "string"
            },
            "potential_health_problems": [
                {
                    "issue": "string",
                    "explanation": "string"
                }
            ],
            "recommendations": [
                {
                    "recommendation": "string"
                }
            ],
            "lifestyle_changes": [
                {
                    "change": "string",
                    "benefits": "string"
                }
            ]
        }

        


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
        print("Sending request to AnythingLLM...")
        print("Headers:", headers)
        print("URL:", url)
        try:
            response = requests.post(url, json=payload, headers=headers)
            print(response.json()["textResponse"])
            return response.json()["textResponse"]
        except requests.exceptions.HTTPError as err:
            print(f"HTTP error occurred: {err}")
        except requests.exceptions.RequestException as err:
            print(f"An error occurred: {err}")

    def generate_overall_report(self, lab_reports):
        prompt = '''
        You are a health assistant designed to analyze a list of lab reports and generate an overall health trend report. The input will be a list of strings, where each string represents a lab report with a date and containing metrics such as blood pressure, cholesterol levels, blood sugar, BMI, and other relevant health data. Your task is to:

        Identify Trends Across Reports:
        do not provide exact data, just provide a concise summary of the trends observed in the lab reports in 2 - 4 sentences.

        the output should be pure text without any new lines or special characters.
        ---

        ### **Input**:\n
        '''
        counter = 1
        for lab_report in lab_reports:
            if lab_report:
                prompt += f"report {counter}: date {lab_report.date.strftime('%Y-%m-%d')} lab content: {lab_report.extracted_text} lab analysis: {lab_report.analysis}\n"
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
