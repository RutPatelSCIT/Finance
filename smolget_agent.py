import os
from smolagents import CodeAgent, DuckDuckGoSearchTool, TransformersModel, LiteLLMModel, tool
from datetime import datetime

try:
    import streamlit as st
    STREAMLIT_AVAILABLE = True
except ImportError:
    STREAMLIT_AVAILABLE = False

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
        
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error calculating expression: {str(e)}"

class SmolgetAgent:
    """
    A SmolAgents-based agent that can perform web searches, calculations, 
    and various analytical tasks through code generation and execution.
    """
    
    def __init__(self, model_type="hf", model_id=None, api_key=None):
        """
        Initialize the SmolgetAgent
        
        Args:
            model_type: "hf" for HuggingFace, "openai" for OpenAI, "anthropic" for Claude
            model_id: Specific model to use
            api_key: API key for the model service
        """
        self.model_type = model_type
        self.model_id = model_id
        self.api_key = api_key
        
        # Initialize the model
        self.model = self._setup_model()
        
        # Initialize tools
        self.tools = self._setup_tools()
        
        # Create the agent
        self.agent = CodeAgent(
            model=self.model,
            tools=self.tools,
            add_base_tools=True,  # Includes PythonInterpreterTool by default
            verbose=True
        )
    
    def _setup_model(self):
        """Setup the language model based on configuration"""
        if self.model_type == "hf":
            # Use HuggingFace model - using a smaller model for demo
            model_id = self.model_id or "HuggingFaceTB/SmolLM2-1.7B-Instruct"
            return TransformersModel(model_id=model_id)
        
        elif self.model_type == "openai":
            # Use OpenAI via LiteLLM
            model_id = self.model_id or "gpt-3.5-turbo"
            return LiteLLMModel(model_id=model_id, api_key=self.api_key)
        
        elif self.model_type == "anthropic":
            # Use Anthropic Claude via LiteLLM
            model_id = self.model_id or "claude-3-haiku-20240307"
            return LiteLLMModel(model_id=f"anthropic/{model_id}", api_key=self.api_key)
        
        else:
            # Default to smaller HuggingFace model
            return TransformersModel(model_id="HuggingFaceTB/SmolLM2-1.7B-Instruct")
    
    def _setup_tools(self):
        """Setup tools for the agent"""
        tools = [
            DuckDuckGoSearchTool(),  # Web search capability
            get_current_time,  # Custom time tool
            advanced_calculator,  # Custom calculator
        ]
        return tools
    
    def run(self, query: str):
        """
        Run a query through the SmolAgents agent
        
        Args:
            query: The question or task to execute
            
        Returns:
            The agent's response
        """
        try:
            result = self.agent.run(query)
            return result
        except Exception as e:
            return f"Error running agent: {str(e)}"
    
    def get_capabilities(self):
        """Return a description of the agent's capabilities"""
        return """
        SmolgetAgent Capabilities:
        
        🔍 Web Search: Can search the internet for current information
        🧮 Calculations: Perform mathematical calculations and data analysis  
        📊 Data Processing: Analyze and visualize data using Python
        ⏰ Time Operations: Get current date/time information
        🐍 Code Execution: Write and execute Python code to solve problems
        📈 Analysis: Perform statistical analysis and create charts
        🌐 Real-time Info: Access up-to-date information from the web
        
        Example queries:
        - "What's the current stock price of Tesla?"
        - "Calculate the compound interest for $1000 at 5% for 10 years"
        - "Find the latest news about AI developments"
        - "Create a chart showing the Fibonacci sequence"
        """

def create_streamlit_app():
    """Create a Streamlit interface for the SmolgetAgent"""
    if not STREAMLIT_AVAILABLE:
        print("❌ Streamlit is not available. Install it with: pip install streamlit")
        return
    
    st.title("🤖 SmolgetAgent - AI Assistant")
    st.markdown("*Powered by SmolAgents & HuggingFace*")
    
    # Sidebar for configuration
    st.sidebar.header("Configuration")
    
    model_type = st.sidebar.selectbox(
        "Model Type",
        ["hf", "openai", "anthropic"],
        help="Choose the AI model provider"
    )
    
    api_key = st.sidebar.text_input(
        "API Key (optional for HF)",
        type="password",
        help="Enter your API key if using OpenAI or Anthropic"
    )
    
    # Initialize agent
    if 'agent' not in st.session_state:
        with st.spinner("Initializing SmolgetAgent..."):
            try:
                st.session_state.agent = SmolgetAgent(
                    model_type=model_type,
                    api_key=api_key if api_key else None
                )
                st.success("Agent initialized successfully!")
            except Exception as e:
                st.error(f"Failed to initialize agent: {str(e)}")
                return
    
    # Display capabilities
    with st.expander("🛠️ Agent Capabilities"):
        st.markdown(st.session_state.agent.get_capabilities())
    
    # Chat interface
    st.header("💬 Chat with SmolgetAgent")
    
    # Example queries
    st.subheader("📝 Example Queries")
    example_queries = [
        "What's the current weather in New York?",
        "Calculate the area of a circle with radius 10",
        "Find the latest news about artificial intelligence",
        "Create a simple plot of y = x^2 for x from -5 to 5",
        "What time is it now?",
    ]
    
    selected_example = st.selectbox("Choose an example query:", [""] + example_queries)
    
    # Query input
    query = st.text_area(
        "Enter your query:",
        value=selected_example,
        height=100,
        placeholder="Ask me anything! I can search the web, do calculations, analyze data, and more..."
    )
    
    if st.button("🚀 Run Query", type="primary"):
        if query.strip():
            with st.spinner("Agent is working..."):
                try:
                    result = st.session_state.agent.run(query)
                    st.success("Query completed!")
                    st.markdown("### 📋 Result:")
                    st.markdown(result)
                except Exception as e:
                    st.error(f"Error: {str(e)}")
        else:
            st.warning("Please enter a query first!")
    
    # Chat history (optional enhancement)
    if 'chat_history' not in st.session_state:
        st.session_state.chat_history = []
    
    if st.button("🗑️ Clear History"):
        st.session_state.chat_history = []
        st.rerun()

def main():
    """Main function to run the SmolgetAgent"""
    print("🤖 SmolgetAgent - AI Assistant powered by SmolAgents")
    print("=" * 50)
    
    # Initialize agent with default HuggingFace model (free)
    try:
        agent = SmolgetAgent(model_type="hf")
        print("✅ Agent initialized successfully!")
        print(agent.get_capabilities())
        
        # Interactive CLI
        while True:
            print("\n" + "="*50)
            query = input("Enter your query (or 'quit' to exit): ").strip()
            
            if query.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            if query:
                print("🤖 Agent is working...")
                try:
                    result = agent.run(query)
                    print("📋 Result:")
                    print(result)
                except Exception as e:
                    print(f"❌ Error: {str(e)}")
            else:
                print("⚠️ Please enter a valid query!")
                
    except Exception as e:
        print(f"❌ Failed to initialize agent: {str(e)}")
        print("💡 Make sure you have smolagents installed: pip install smolagents")

if __name__ == "__main__":
    # Check if running in Streamlit context
    if STREAMLIT_AVAILABLE:
        try:
            # Check if we're in a streamlit context by looking for streamlit in sys.argv
            import sys
            if 'streamlit' in ' '.join(sys.argv):
                create_streamlit_app()
            else:
                main()
        except Exception:
            main()
    else:
        # Run as CLI application
        main()