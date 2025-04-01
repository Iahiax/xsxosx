import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Cloud, Server, Database, HardDrive, Folder, File, Settings, Shield, Network, GitBranch, Key, Copy, Clipboard } from 'lucide-react';

interface Command {
  input: string;
  output: string;
  timestamp: string;
}

interface Instance {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  type: 'compute' | 'database' | 'storage' | 'network' | 'security';
}

interface GitRepo {
  name: string;
  url: string;
  status: 'cloned' | 'cloning' | 'error';
}

interface SSHKey {
  name: string;
  publicKey: string;
  fingerprint: string;
  created: string;
}

function App() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [instances, setInstances] = useState<Instance[]>([]);
  const [gitRepos, setGitRepos] = useState<GitRepo[]>([]);
  const [sshKeys, setSSHKeys] = useState<SSHKey[]>([]);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getTimestamp = () => {
    return new Date().toLocaleTimeString();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      setCopySuccess('Failed to copy');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCurrentInput(prev => prev + text);
      inputRef.current?.focus();
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  // ... [Keep all existing functions like generateInstanceId, generateSSHKey, etc.]

  const handleCommand = (input: string) => {
    let output = '';
    const commandParts = input.trim().split(' ');
    const command = commandParts[0];

    // ... [Keep all existing command handling logic]

    const newCommand: Command = {
      input,
      output,
      timestamp: getTimestamp(),
    };

    setCommands(prev => [...prev, newCommand]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim()) {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black rounded-lg shadow-xl overflow-hidden">
          {/* Title Bar */}
          <div className="bg-gray-800 px-2 sm:px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center text-gray-400">
              <Cloud className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="text-sm sm:text-base">Cloud Terminal Simulator</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePaste}
                className="text-gray-400 hover:text-white transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Instance Status Bar */}
          <div className="bg-gray-800/50 px-2 sm:px-4 py-2 border-b border-gray-700">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center">
                <Server className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Compute: {instances.filter(i => i.type === 'compute').length}</span>
              </div>
              <div className="flex items-center">
                <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>DB: {instances.filter(i => i.type === 'database').length}</span>
              </div>
              <div className="flex items-center">
                <HardDrive className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Storage: {instances.filter(i => i.type === 'storage').length}</span>
              </div>
              <div className="flex items-center">
                <Network className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Net: {instances.filter(i => i.type === 'network').length}</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>Sec: {instances.filter(i => i.type === 'security').length}</span>
              </div>
              <div className="flex items-center">
                <Key className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span>SSH: {sshKeys.length}</span>
              </div>
            </div>
          </div>

          {/* Terminal Area */}
          <div
            ref={terminalRef}
            className="p-2 sm:p-4 h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-y-auto font-mono text-sm sm:text-base relative"
            style={{ maxHeight: 'calc(100vh - 250px)' }}
          >
            <div className="mb-4 text-gray-400">
              Welcome to Cloud Terminal Simulator v2.0
              Type 'help' to see available commands
            </div>
            
            {commands.map((cmd, index) => (
              <div key={index} className="mb-2 group">
                <div className="flex items-center text-gray-400">
                  <span className="text-blue-400">{currentPath}</span>
                  <span className="mx-2">$</span>
                  <span className="text-white flex-grow">{cmd.input}</span>
                  <button
                    onClick={() => copyToClipboard(cmd.input)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white ml-2"
                    title="Copy command"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {cmd.output && (
                  <div className="mt-1 whitespace-pre-wrap text-xs sm:text-sm group relative">
                    {cmd.output}
                    <button
                      onClick={() => copyToClipboard(cmd.output)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-white absolute right-0 top-0"
                      title="Copy output"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Current Input Line */}
            <form onSubmit={handleSubmit} className="flex items-center mt-2">
              <span className="text-blue-400">{currentPath}</span>
              <span className="mx-2 text-gray-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white text-sm sm:text-base"
                autoFocus
              />
            </form>

            {/* Copy Success Message */}
            {copySuccess && (
              <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
                {copySuccess}
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-4 sm:mt-6 bg-gray-800 rounded-lg p-2 sm:p-4 text-gray-300">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Quick Reference</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">System</h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>• help - Show all commands</li>
                <li>• clear - Clear screen</li>
                <li>• pwd - Show current directory</li>
                <li>• ls - List files</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">SSH Commands</h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>• ssh-keygen - Generate key</li>
                <li>• ssh-add - Add key</li>
                <li>• ssh-list - List keys</li>
                <li>• ssh user@host - Connect</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Cloud</h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>• create instance [name] [type]</li>
                <li>• instances list</li>
                <li>• start/stop instance [name]</li>
                <li>• describe instance [name]</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Network</h3>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>• ping [host]</li>
                <li>• ifconfig</li>
                <li>• netstat</li>
                <li>• curl/wget [url]</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;