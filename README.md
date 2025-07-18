# 🤖 SmolgetAgent - AI Assistant powered by SmolAgents

A powerful AI assistant built using HuggingFace's SmolAgents framework that can perform web searches, calculations, data analysis, and code execution through natural language queries.

## ✨ Features

- 🔍 **Web Search**: Access real-time information from the internet
- 🧮 **Mathematical Calculations**: Perform complex calculations and financial computations
- 📊 **Data Analysis & Visualization**: Create charts, analyze data, and generate insights
- 🐍 **Code Execution**: Write and execute Python code to solve problems
- ⏰ **Time Operations**: Get current date/time information
- 🌐 **Multi-Model Support**: Works with HuggingFace, OpenAI, and Anthropic models
- 💻 **Multiple Interfaces**: CLI, Streamlit web app, and programmatic API

## 🚀 Quick Start

### Installation

1. **Clone or download the files**
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

### Basic Usage

#### 1. Command Line Interface (CLI)
```bash
python smolget_agent.py
```

#### 2. Web Interface (Streamlit)
```bash
streamlit run smolget_agent.py
```

#### 3. Programmatic Usage
```python
from smolget_agent import SmolgetAgent

# Initialize agent
agent = SmolgetAgent(model_type="hf")  # Free HuggingFace model

# Run a query
result = agent.run("What's the weather like in Paris today?")
print(result)
```

#### 4. Example Demonstrations
```bash
python example_usage.py
```

## 🛠️ Configuration Options

### Model Providers

#### HuggingFace (Free - Default)
```python
agent = SmolgetAgent(model_type="hf")
# or with specific model
agent = SmolgetAgent(
    model_type="hf", 
    model_id="Qwen/Qwen2.5-Coder-32B-Instruct",
    api_key="your_hf_token"  # optional
)
```

#### OpenAI
```python
agent = SmolgetAgent(
    model_type="openai",
    model_id="gpt-4",
    api_key="your_openai_api_key"
)
```

#### Anthropic Claude
```python
agent = SmolgetAgent(
    model_type="anthropic",
    model_id="claude-3-haiku-20240307",
    api_key="your_anthropic_api_key"
)
```

## 📝 Example Queries

### 🧮 Mathematical Calculations
```
"Calculate the compound interest for $1000 at 5% for 10 years"
"What's the area of a circle with radius 15?"
"Solve the quadratic equation x^2 + 5x + 6 = 0"
```

### 🔍 Web Search & Information
```
"What's the current stock price of Apple?"
"Find the latest news about SpaceX"
"What's the weather in Tokyo right now?"
```

### 📊 Data Analysis & Visualization
```
"Create a chart showing the Fibonacci sequence"
"Plot a sine wave from 0 to 2π"
"Generate a bar chart of the top 5 programming languages"
```

### 🐍 Code Execution
```
"Write Python code to find all prime numbers under 100"
"Create a function to convert Celsius to Fahrenheit"
"Generate a simple web scraper for quotes"
```

## 🏗️ Architecture

### Core Components

1. **SmolgetAgent Class**: Main agent wrapper
2. **Model Integration**: Support for multiple LLM providers
3. **Tool System**: Extensible tool framework
4. **Code Execution**: Safe Python code generation and execution
5. **Web Interface**: Streamlit-based GUI

### Built-in Tools

- **DuckDuckGoSearchTool**: Web search capabilities
- **PythonInterpreterTool**: Code execution (built-in)
- **Advanced Calculator**: Mathematical computations
- **Time Tool**: Date and time operations

## 🔧 Advanced Configuration

### Custom Tools

You can extend the agent with custom tools:

```python
from transformers import tool

@tool
def weather_tool(city: str) -> str:
    """Get weather information for a city"""
    # Your weather API implementation
    return f"Weather in {city}: Sunny, 25°C"

# Add to agent
agent = SmolgetAgent(model_type="hf")
agent.tools.append(weather_tool)
```

### Environment Variables

Create a `.env` file for API keys:
```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
HF_TOKEN=your_huggingface_token
```

## 📁 Project Structure

```
smolget-agent/
├── smolget_agent.py      # Main agent implementation
├── example_usage.py      # Example demonstrations
├── requirements.txt      # Dependencies
├── README.md            # This file
├── dna-app.py          # Existing DNA app
├── finance.py          # Existing finance app
└── dna-logo.jpg        # Logo file
```

## 🛡️ Safety & Security

- **Sandboxed Execution**: Code runs in controlled environment
- **Input Validation**: Mathematical expressions are validated
- **Limited Imports**: Only authorized Python modules allowed
- **Error Handling**: Graceful error management

## 🚨 Troubleshooting

### Common Issues

1. **Import Errors**:
   ```bash
   pip install --upgrade smolagents transformers torch
   ```

2. **Model Loading Issues**:
   - Check internet connection for HuggingFace models
   - Verify API keys for OpenAI/Anthropic
   - Try different model IDs

3. **Tool Errors**:
   - DuckDuckGo search requires internet connection
   - Some calculations may timeout for complex operations

### Error Messages

- `"Error running agent"`: Check model configuration and API keys
- `"Failed to initialize agent"`: Install missing dependencies
- `"Tool execution failed"`: Check internet connection and permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Test thoroughly
5. Submit a pull request

### Ideas for Enhancement

- Add more specialized tools (weather, stocks, etc.)
- Implement conversation memory
- Add support for more model providers
- Create mobile-friendly interface
- Add voice input/output

## 📚 Resources

- [SmolAgents Documentation](https://huggingface.co/docs/smolagents)
- [HuggingFace Hub](https://huggingface.co/)
- [Transformers Library](https://huggingface.co/docs/transformers)
- [Streamlit Documentation](https://docs.streamlit.io/)

## 📄 License

This project is open source and available under the MIT License.

## 🙋 Support

For questions and support:
1. Check the troubleshooting section above
2. Review the example usage
3. Consult the SmolAgents documentation
4. Open an issue for bugs or feature requests

---

**Happy coding with SmolgetAgent! 🚀**