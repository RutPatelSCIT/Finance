#!/usr/bin/env python3
"""
Example usage of SmolgetAgent
Demonstrates various capabilities of the SmolAgents-powered AI assistant
"""

from smolget_agent import SmolgetAgent
import time

def main():
    """Run example queries with the SmolgetAgent"""
    
    print("🤖 SmolgetAgent Example Usage")
    print("=" * 50)
    
    # Initialize the agent
    print("🔧 Initializing SmolgetAgent...")
    try:
        # Using HuggingFace model (free, no API key required)
        agent = SmolgetAgent(model_type="hf")
        print("✅ Agent initialized successfully!")
    except Exception as e:
        print(f"❌ Failed to initialize agent: {e}")
        print("💡 Make sure you have installed the requirements: pip install -r requirements.txt")
        return
    
    # Example queries to demonstrate capabilities
    example_queries = [
        {
            "description": "🧮 Mathematical Calculation",
            "query": "Calculate the compound interest for $5000 invested at 7% annual rate for 10 years using the formula A = P(1 + r)^t"
        },
        {
            "description": "⏰ Current Time",
            "query": "What time is it now?"
        },
        {
            "description": "🔍 Web Search",
            "query": "What are the latest developments in artificial intelligence in 2024?"
        },
        {
            "description": "📊 Data Analysis & Visualization",
            "query": "Create a simple plot showing the first 10 numbers of the Fibonacci sequence"
        },
        {
            "description": "🐍 Python Code Execution",
            "query": "Write Python code to find all prime numbers less than 50 and show them in a list"
        }
    ]
    
    # Run each example
    for i, example in enumerate(example_queries, 1):
        print(f"\n{'='*60}")
        print(f"Example {i}: {example['description']}")
        print(f"Query: {example['query']}")
        print("-" * 60)
        
        try:
            print("🤖 Agent is working...")
            result = agent.run(example['query'])
            print("📋 Result:")
            print(result)
            
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Small delay between queries
        time.sleep(2)
    
    print(f"\n{'='*60}")
    print("🎉 Example usage completed!")
    print("💡 You can now run 'python smolget_agent.py' for interactive CLI")
    print("💡 Or run 'streamlit run smolget_agent.py' for web interface")

if __name__ == "__main__":
    main()