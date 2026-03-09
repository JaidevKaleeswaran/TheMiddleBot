from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

def check_console_errors(url, name):
    print(f"\nChecking {name} at {url}...")
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)
    
    try:
        driver.get(url)
        time.sleep(3) # Wait for React to mount and throw errs
        
        # Print browser console logs
        for entry in driver.get_log('browser'):
            if entry['level'] == 'SEVERE':
                print(f"[{name} CONSOLE ERROR]: {entry['message']}")
                
        # Also check page source for our custom injected error display
        page_source = driver.page_source
        if "ERROR:" in page_source or "PROMISE REJECTION:" in page_source:
            print(f"[{name} INJECTED ERROR CAUGHT IN HTML]")
            
        print(f"[{name} check complete]")
    except Exception as e:
        print(f"[{name} SCRIPT ERROR]: {e}")
    finally:
        driver.quit()

if __name__ == "__main__":
    check_console_errors("http://localhost:5173", "Client")
