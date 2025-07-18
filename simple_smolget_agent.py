#!/usr/bin/env python3
"""
Simple SmolgetAgent - A lightweight AI assistant using SmolAgents
Focuses on web search and basic calculations without heavy model dependencies
"""

import os
from smolagents import CodeAgent, DuckDuckGoSearchTool, tool
from datetime import datetime

# Define custom tools
@tool
def get_current_time() -> str:
    """
    Returns the current date and time in a readable format.
    """
    now = datetime.now()
    return f"Current date and time: {now.strftime('%Y-%m-%d %H:%M:%S')}"

@tool  
def advanced_calculator(expression: str) -> str:
    """
    Safely evaluate mathematical expressions.
    
    Args:
        expression: Mathematical expression to evaluate (e.g., "2+2*3")
    """
    try:
        # Basic safety check - only allow safe mathematical operations
        allowed_chars = set('0123456789+-*/.() ')
        if not all(c in allowed_chars for c in expression):
            return "Error: Only basic mathematical operations are allowed"
        
        # Evaluate the expression
        result = eval(expression)
        return f"Result: {expression} = {result}"
    except Exception as e:
        return f"Error calculating {expression}: {str(e)}"

class SimpleSmolgetAgent:
    """
    A simplified SmolAgents-based agent that uses the OpenAI-compatible API
    or a local endpoint for language model capabilities.
    """
    
    def __init__(self, model_endpoint=None, api_key=None):
        """
        Initialize the SimpleSmolgetAgent
        
        Args:
            model_endpoint: API endpoint for the model (defaults to OpenAI)
            api_key: API key for the model service
        """
        # Try to use LiteLLMModel for API-based models
        try:
            from smolagents import LiteLLMModel
            if api_key:
                self.model = LiteLLMModel(model_id="gpt-3.5-turbo", api_key=api_key)
            else:
                # Try to use environment variable
                api_key = os.getenv("OPENAI_API_KEY")
                if api_key:
                    self.model = LiteLLMModel(model_id="gpt-3.5-turbo", api_key=api_key)
                else:
                    raise ValueError("No API key provided and OPENAI_API_KEY not set")
        except Exception as e:
            print(f"⚠️  Could not initialize API model: {e}")
            print("💡 To use this agent with an API model, set your OPENAI_API_KEY environment variable")
            print("📝 For now, creating agent without model (tools only)")
            self.model = None
        
        # Initialize tools
        self.tools = self._setup_tools()
        
        # Create the agent (will work even without model for basic tool usage)
        if self.model:
            self.agent = CodeAgent(
                model=self.model,
                tools=self.tools,
                add_base_tools=True,
                verbose=True
            )
        else:
            print("🔧 Agent initialized in tools-only mode")
            self.agent = None
    
    def _setup_tools(self):
        """Setup tools for the agent"""
        tools = [
            DuckDuckGoSearchTool(),  # Web search capability
            get_current_time,  # Time tool
            advanced_calculator,  # Calculator
        ]
        return tools
    
    def run(self, query: str) -> str:
        """
        Execute a query using the SmolgetAgent
        
        Args:
            query: The user's question or request
        
        Returns:
            str: The agent's response
        """
        if not self.agent:
            # Fallback: try to use tools directly
            return self._run_tools_only(query)
        
        try:
            print(f"🔍 Processing query: {query}")
            result = self.agent.run(query)
            return result
        except Exception as e:
            print(f"❌ Error processing query: {e}")
            return f"Sorry, I encountered an error: {str(e)}"
    
    def _run_tools_only(self, query: str) -> str:
        """Fallback method to use tools without the full agent"""
        query_lower = query.lower()
        
        if "time" in query_lower or "date" in query_lower:
            return get_current_time()
        elif any(op in query for op in ['+', '-', '*', '/', '(', ')']):
            # Extract mathematical expression (simple heuristic)
            import re
            math_expr = re.findall(r'[0-9+\-*/().\s]+', query)
            if math_expr:
                return advanced_calculator(math_expr[0].strip())
        elif "search" in query_lower:
            try:
                search_tool = DuckDuckGoSearchTool()
                # Extract search terms (simple heuristic)
                search_terms = query.replace("search", "").replace("for", "").strip()
                result = search_tool.forward(search_terms)
                return f"Search results for '{search_terms}':\n{result}"
            except Exception as e:
                return f"Search failed: {e}"
        
        return "I can help with time queries, calculations, and web searches. Please specify what you'd like to do."

def main():
    """CLI interface for the SimpleSmolgetAgent"""
    print("🤖 Simple SmolgetAgent - AI Assistant")
    print("=" * 50)
    
    # Initialize the agent
    try:
        agent = SimpleSmolgetAgent()
        print("✅ Agent initialized!")
    except Exception as e:
        print(f"❌ Failed to initialize agent: {e}")
        return
    
    # Example queries
    example_queries = [
        "What time is it?",
        "Calculate 15 * 23 + 45",
        "Search for latest news about artificial intelligence"
    ]
    
    print("\n📝 Example queries you can try:")
    for i, query in enumerate(example_queries, 1):
        print(f"{i}. {query}")
    
    print("\n" + "=" * 50)
    
    # Interactive mode
    while True:
        try:
            user_input = input("\n💬 Your query (or 'quit' to exit): ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            if not user_input:
                continue
            
            print("\n🤔 Processing...")
            response = agent.run(user_input)
            print(f"\n🤖 Response: {response}")
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()