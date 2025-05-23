import React, { useState, useEffect } from 'react';

const App = () => {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('customer');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Mock data for orders
  const mockOrders = [
    { id: 1, status: 'queued', customerName: 'Anna Müller', estimatedTime: 15, items: ['Classic Nutella', 'Banana'], station: 1 },
    { id: 2, status: 'queued', customerName: 'Lars Schmidt', estimatedTime: 12, items: ['Savory Ham & Cheese'], station: 2 },
    { id: 3, status: 'in-progress', customerName: 'Sophie Becker', estimatedTime: 5, items: ['Berry Delight'], station: 3 },
    { id: 4, status: 'ready', customerName: 'Max Weber', estimatedTime: 0, items: ['Green Tea Matcha'], station: 1 },
  ];
  
  // Mock data for users
  const mockUsers = [
    { id: 1, name: 'John Doe', role: 'owner', email: 'owner@example.com' },
    { id: 2, name: 'Jane Smith', role: 'waiter', email: 'waiter@example.com' },
    { id: 3, name: 'Mike Johnson', role: 'maker', email: 'maker@example.com' },
    { id: 4, name: 'Sarah Williams', role: 'admin', email: 'admin@example.com' },
  ];
  
  // Predefined crêpe creations
  const predefinedCrêpes = [
    { id: 1, name: 'Classic Nutella', ingredients: ['Nutella', 'Schokostreusel', 'Schlagsahne'], price: 4.50 },
    { id: 2, name: 'Savory Ham & Cheese', ingredients: ['Schinken', 'Käse', 'Tomatensauce'], price: 5.00 },
    { id: 3, name: 'Berry Delight', ingredients: ['Himbeeren', 'Blaue Beeren', 'Joghurt'], price: 4.80 },
    { id: 4, name: 'Green Tea Matcha', ingredients: ['Matcha-Pulver', 'Eis', 'Milch'], price: 4.20 },
    { id: 5, name: 'Tropical Dream', ingredients: ['Mango', 'Ananas', 'Kokosraspeln'], price: 4.70 },
  ];
  
  // Available ingredients for custom crêpe
  const availableIngredients = ['Nutella', 'Schokostreusel', 'Schlagsahne', 'Schinken', 'Käse', 'Tomatensauce', 
                                'Himbeeren', 'Blaue Beeren', 'Joghurt', 'Matcha-Pulver', 'Eis', 'Milch', 
                                'Mango', 'Ananas', 'Kokosraspeln'];
  
  // Login function
  const handleLogin = (role, password) => {
    // In a real app, this would authenticate against Firebase
    // Here we simulate a successful login with a simple check
    if (password === 'password123') {
      const user = mockUsers.find(u => u.role === role);
      if (user) {
        setCurrentUser(user);
        setCurrentView(role);
        showNotification(`Willkommen, ${user.name}!`, 'success');
      } else {
        showNotification('Login fehlgeschlagen', 'error');
      }
    } else {
      showNotification('Falsches Passwort', 'error');
    }
  };
  
  // Logout function
  const handleLogout = () => {
    showNotification(`Erfolgreich ausgeloggt`, 'success');
    setCurrentUser(null);
    setCurrentView('customer');
  };
  
  // Show notification
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Add new order
  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: orders.length + 1,
      status: 'queued',
      createdAt: new Date().toISOString(),
      station: Math.floor(Math.random() * 3) + 1 // Random station assignment
    };
    setOrders([...orders, newOrder]);
    showNotification(`Bestellung #${newOrder.id} wurde hinzugefügt`, 'success');
  };
  
  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    showNotification(`Bestellung #${orderId} wurde als "${newStatus}" markiert`, 'success');
  };
  
  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
  const ordersToday = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  }).length;
  const averageWaitTime = orders.reduce((sum, order) => sum + (order.estimatedTime || 0), 0) / orders.length || 0;
  
  // Render different views based on currentView state
  const renderView = () => {
    switch(currentView) {
      case 'customer':
        return <CustomerView orders={orders} showNotification={showNotification} />;
      case 'waiter':
        return <WaiterView 
                 onAddOrder={addOrder} 
                 predefinedCrêpes={predefinedCrêpes} 
                 availableIngredients={availableIngredients}
                 showNotification={showNotification}
               />;
      case 'maker':
        return <MakerView 
                 orders={orders} 
                 onUpdateStatus={updateOrderStatus} 
                 selectedOrder={selectedOrder} 
                 onSelectOrder={setSelectedOrder}
                 showNotification={showNotification}
               />;
      case 'owner':
        return <OwnerView 
                 orders={orders} 
                 users={mockUsers} 
                 totalRevenue={totalRevenue} 
                 ordersToday={ordersToday} 
                 averageWaitTime={averageWaitTime}
                 showNotification={showNotification}
               />;
      case 'admin':
        return <AdminView 
                 orders={orders} 
                 users={mockUsers} 
                 totalRevenue={totalRevenue} 
                 ordersToday={ordersToday} 
                 averageWaitTime={averageWaitTime}
                 predefinedCrêpes={predefinedCrêpes}
                 showNotification={showNotification}
               />;
      case 'login':
        return <LoginView onLogin={handleLogin} onBack={() => setCurrentView(currentUser ? currentView : 'customer')} />;
      default:
        return <CustomerView orders={orders} showNotification={showNotification} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Notification */}
      {notification && (
        <div 
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ${
            notification.type === 'success' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-red-600 text-white'
          }`}
        >
          {notification.message}
        </div>
      )}
      
      {/* Header */}
      <header className="bg-emerald-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Crêpe Master</h1>
          
          {/* Navigation */}
          <nav>
            <ul className="flex space-x-4">
              <li><button onClick={() => setCurrentView('customer')} className={`px-3 py-2 rounded-md ${currentView === 'customer' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}>Kunde</button></li>
              {currentUser && (
                <>
                  <li><button onClick={() => setCurrentView('waiter')} className={`px-3 py-2 rounded-md ${currentView === 'waiter' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}>Kassierer</button></li>
                  <li><button onClick={() => setCurrentView('maker')} className={`px-3 py-2 rounded-md ${currentView === 'maker' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}>Hersteller</button></li>
                  <li><button onClick={() => setCurrentView('owner')} className={`px-3 py-2 rounded-md ${currentView === 'owner' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}>Owner</button></li>
                  <li><button onClick={() => setCurrentView('admin')} className={`px-3 py-2 rounded-md ${currentView === 'admin' ? 'bg-emerald-700' : 'hover:bg-emerald-700'}`}>Admin</button></li>
                </>
              )}
            </ul>
          </nav>
          
          {/* User menu */}
          <div className="relative">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">{currentUser.name}</span>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors">Logout</button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentView('login')} 
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto py-8">
        {renderView()}
      </main>
      
      {/* Footer */}
      <footer className="bg-emerald-800 text-white p-4 mt-12">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Crêpe Master. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  );
};

// Customer View Component
const CustomerView = ({ orders, showNotification }) => {
  const [orderNumber, setOrderNumber] = useState('');
  const [waitTime, setWaitTime] = useState(null);
  const [ordersAhead, setOrdersAhead] = useState(0);
  const [fiveMinuteWarning, setFiveMinuteWarning] = useState(false);
  
  const handleCheckStatus = () => {
    if (orderNumber && !isNaN(orderNumber)) {
      const order = orders.find(o => o.id === parseInt(orderNumber));
      if (order) {
        const queuedOrders = orders.filter(o => o.status === 'queued' || o.status === 'in-progress');
        const orderIndex = queuedOrders.findIndex(o => o.id === parseInt(orderNumber));
        
        if (orderIndex >= 0) {
          setOrdersAhead(orderIndex);
          setWaitTime(order.estimatedTime * (orderIndex + 1));
          setFiveMinuteWarning(order.estimatedTime * (orderIndex + 1) <= 5);
        } else {
          setWaitTime(0);
          setOrdersAhead(0);
          setFiveMinuteWarning(false);
        }
      } else {
        setWaitTime(null);
        setOrdersAhead(0);
        setFiveMinuteWarning(false);
        showNotification('Bestellung nicht gefunden', 'error');
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Bestellstatus prüfen</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-600 mb-4">Geben Sie Ihre Bestellnummer ein, um den aktuellen Status zu erfahren:</p>
        
        <div className="flex">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Bestellnummer"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleCheckStatus}
            className="bg-emerald-600 text-white px-4 py-2 rounded-r-md hover:bg-emerald-700 transition-colors"
          >
            Prüfen
          </button>
        </div>
      </div>
      
      {waitTime !== null && (
        <div className={`bg-white rounded-lg shadow-md p-6 transform transition-all duration-300 ${fiveMinuteWarning ? 'animate-pulse' : ''}`}>
          {waitTime > 0 ? (
            <>
              <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Ihre Bestellung ist in Bearbeitung</h3>
              <p className="text-gray-700 mb-2">Es sind noch <span className="font-bold">{ordersAhead}</span> Bestellungen vor Ihnen.</p>
              <p className="text-gray-700">Die geschätzte Wartezeit beträgt noch <span className="font-bold">{waitTime} Minuten</span>.</p>
              
              {fiveMinuteWarning && (
                <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                  <p className="font-bold">Fast fertig!</p>
                  <p>Ihre Bestellung ist gleich bereit. Bereiten Sie sich auf den Crêpe-Stand vor!</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Ihre Bestellung ist bereit!</h3>
              <p className="text-gray-700">Ihre Bestellung wurde bereits fertiggestellt. Begeben Sie sich bitte zum Crêpe-Stand.</p>
            </>
          )}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <img src="https://picsum.photos/600/400 " alt="Crêpes" className="rounded-lg shadow-md mx-auto mb-4" />
        <p className="text-gray-600">Genießen Sie unsere köstlichen Crêpes, frisch zubereitet!</p>
      </div>
    </div>
  );
};

// Login View Component
const LoginView = ({ onLogin, onBack }) => {
  const [role, setRole] = useState('waiter');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(role, password);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 animate-fade-in">
        <h2 className="text-2xl font-bold text-emerald-800 mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 mb-2">Rolle</label>
            <select 
              id="role" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="waiter">Kassierer</option>
              <option value="maker">Hersteller</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">Passwort</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md" 
              required 
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onBack} 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Anmelden
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Waiter View Component
const WaiterView = ({ onAddOrder, predefinedCrêpes, availableIngredients, showNotification }) => {
  const [step, setStep] = useState(1);
  const [selectedCrêpe, setSelectedCrêpe] = useState(null);
  const [customCrêpe, setCustomCrêpe] = useState({ name: '', ingredients: [], price: 0 });
  const [customerName, setCustomerName] = useState('');
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSelectCrêpe = (crêpe) => {
    setSelectedCrêpe(crêpe);
    setStep(2);
  };
  
  const handleAddIngredient = (ingredient) => {
    if (!customCrêpe.ingredients.includes(ingredient)) {
      setCustomCrêpe({
        ...customCrêpe,
        ingredients: [...customCrêpe.ingredients, ingredient],
        price: customCrêpe.price + 0.5
      });
    }
  };
  
  const handleRemoveIngredient = (ingredient) => {
    setCustomCrêpe({
      ...customCrêpe,
      ingredients: customCrêpe.ingredients.filter(i => i !== ingredient),
      price: customCrêpe.price - 0.5
    });
  };
  
  const handleCreateCustomCrêpe = () => {
    setStep(2);
  };
  
  const handleConfirmOrder = () => {
    const order = {
      customerName,
      items: selectedCrêpe ? [selectedCrêpe.name] : [customCrêpe.name],
      price: selectedCrêpe ? selectedCrêpe.price : customCrêpe.price,
      estimatedTime: 10
    };
    
    onAddOrder(order);
    showNotification('Bestellung erfolgreich erfasst', 'success');
    setStep(3);
  };
  
  const handleFinishOrder = () => {
    setStep(1);
    setSelectedCrêpe(null);
    setCustomCrêpe({ name: '', ingredients: [], price: 0 });
    setCustomerName('');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Neue Bestellung erfassen</h2>
      
      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Wählen Sie eine Crêpe-Variante</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {predefinedCrêpes.map(crêpe => (
              <div 
                key={crêpe.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 transition-colors cursor-pointer transform hover:scale-105 transition-transform"
                onClick={() => handleSelectCrêpe(crêpe)}
              >
                <h4 className="font-bold text-lg">{crêpe.name}</h4>
                <p className="text-sm text-gray-600">{crêpe.ingredients.join(', ')}</p>
                <p className="text-emerald-600 font-semibold mt-2">{crêpe.price.toFixed(2)} €</p>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleCreateCustomCrêpe}
            className="w-full bg-emerald-600 text-white py-3 rounded-md hover:bg-emerald-700 transition-colors transform hover:scale-105 transition-transform"
          >
            Individuelle Crêpe zusammenstellen
          </button>
        </div>
      )}
      
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">
            {selectedCrêpe ? 'Bestellung bestätigen' : 'Individuelle Crêpe zusammenstellen'}
          </h3>
          
          {!selectedCrêpe && (
            <div className="mb-6">
              <label htmlFor="customName" className="block text-gray-700 mb-2">Name für Ihre Crêpe</label>
              <input
                type="text"
                id="customName"
                value={customCrêpe.name}
                onChange={(e) => setCustomCrêpe({...customCrêpe, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                placeholder="z.B. Meine Lieblingscrêpe"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {availableIngredients.map(ingredient => (
                  <div key={ingredient} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`ingredient-${ingredient}`}
                      checked={customCrêpe.ingredients.includes(ingredient)}
                      onChange={() => 
                        customCrêpe.ingredients.includes(ingredient) 
                          ? handleRemoveIngredient(ingredient) 
                          : handleAddIngredient(ingredient)
                      }
                      className="mr-2"
                    />
                    <label htmlFor={`ingredient-${ingredient}`}>{ingredient}</label>
                  </div>
                ))}
              </div>
              
              <p className="text-right text-lg font-semibold text-emerald-600">
                Geschätzter Preis: {customCrêpe.price.toFixed(2)} €
              </p>
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="customerName" className="block text-gray-700 mb-2">Kundenname</label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Vor- und Nachname"
            />
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={handlePrevStep}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Zurück
            </button>
            <button 
              onClick={handleConfirmOrder}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
            >
              Bestellung bestätigen
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center animate-fade-in">
          <h3 className="text-2xl font-semibold text-emerald-700 mb-4">Bestellung erfolgreich erfasst!</h3>
          
          <div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 inline-block rounded-md transform transition-transform animate-bounce">
            <p className="text-4xl font-bold">#{orders.length + 1}</p>
            <p className="mt-2">Merken Sie sich diese Nummer</p>
          </div>
          
          <p className="text-gray-700 mb-6">Teilen Sie dem Kunden die Bestellnummer mit, damit er den Status seiner Bestellung verfolgen kann.</p>
          
          <button 
            onClick={handleFinishOrder}
            className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors transform hover:scale-105"
          >
            Neue Bestellung erfassen
          </button>
        </div>
      )}
    </div>
  );
};

// Maker View Component
const MakerView = ({ orders, onUpdateStatus, selectedOrder, onSelectOrder, showNotification }) => {
  const [selectedStation, setSelectedStation] = useState(1);
  
  // Filter orders for the selected station
  const stationOrders = orders.filter(order => order.station === selectedStation);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Herstellerbereich - Station {selectedStation}</h2>
      
      <div className="flex justify-center mb-8 space-x-4">
        {[1, 2, 3].map(station => (
          <button
            key={station}
            onClick={() => setSelectedStation(station)}
            className={`px-6 py-3 rounded-md transition-colors ${
              selectedStation === station ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Station {station}
          </button>
        ))}
      </div>
      
      {stationOrders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stationOrders.map(order => (
            <div 
              key={order.id} 
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105 ${
                selectedOrder?.id === order.id ? 'ring-2 ring-emerald-500' : ''
              }`}
              onClick={() => onSelectOrder(order)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Bestellung #{order.id}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status === 'queued' ? 'In Warteschlange' :
                   order.status === 'in-progress' ? 'In Bearbeitung' : 'Fertig'}
                </span>
              </div>
              
              <p className="text-gray-700 mb-2"><span className="font-semibold">Kunde:</span> {order.customerName}</p>
              <p className="text-gray-700 mb-4"><span className="font-semibold">Bestellzeit:</span> {new Date(order.createdAt).toLocaleTimeString()}</p>
              
              <div className="mb-4">
                <h4 className="font-semibold text-emerald-700 mb-2">Zutaten:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(order.id, 'in-progress');
                    onSelectOrder(order);
                    showNotification(`Bestellung #${order.id} in Bearbeitung`, 'success');
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors"
                >
                  In Bearbeitung
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(order.id, 'ready');
                    onSelectOrder(order);
                    showNotification(`Bestellung #${order.id} fertiggestellt`, 'success');
                  }}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm transition-colors"
                >
                  Fertigstellen
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg">Momentan gibt es keine Bestellungen für diese Station.</p>
          <p className="text-gray-500 mt-2">Bitte wählen Sie eine andere Station oder warten Sie auf neue Bestellungen.</p>
        </div>
      )}
      
      {selectedOrder && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6 animate-fade-in">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Aktuelle Bestellung</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Zutaten</h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="text-gray-600">{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Zubereitungshinweise</h4>
              <p className="text-gray-600">
                Bitte backen Sie den Crêpe goldbraun und falten Sie ihn ordentlich. 
                Achten Sie darauf, dass alle Zutaten frisch und in guter Qualität sind.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button 
              onClick={() => {
                onUpdateStatus(selectedOrder.id, 'in-progress');
                showNotification(`Bestellung #${selectedOrder.id} in Bearbeitung`, 'success');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              In Bearbeitung
            </button>
            <button 
              onClick={() => {
                onUpdateStatus(selectedOrder.id, 'ready');
                showNotification(`Bestellung #${selectedOrder.id} fertiggestellt`, 'success');
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Fertigstellen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Owner View Component
const OwnerView = ({ orders, users, totalRevenue, ordersToday, averageWaitTime, showNotification }) => {
  const [activeTab, setActiveTab] = useState('orders');
  
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Owner Dashboard</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'orders' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
          }`}
        >
          Bestellungen
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'users' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
          }`}
        >
          Benutzer
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'analytics' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
          }`}
        >
          Analysen
        </button>
      </div>
      
      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Aktuelle Bestellungen</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Bestellnummer</th>
                  <th className="px-4 py-2 text-left">Kunde</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Uhrzeit</th>
                  <th className="px-4 py-2 text-right">Preis</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">#{order.id}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'queued' ? 'In Warteschlange' :
                         order.status === 'in-progress' ? 'In Bearbeitung' : 'Fertig'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(order.createdAt).toLocaleTimeString()}</td>
                    <td className="px-4 py-3 text-right">{(order.price || 0).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Benutzerverwaltung</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rolle</th>
                  <th className="px-4 py-2 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3 text-right">
                      <select 
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                        defaultValue={user.role}
                        onChange={(e) => {
                          showNotification(`Rolle von ${user.name} geändert`, 'success');
                        }}
                      >
                        <option value="waiter">Kassierer</option>
                        <option value="maker">Hersteller</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-emerald-700 mb-2">Neuen Benutzer hinzufügen</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Name" className="px-3 py-2 border border-gray-300 rounded-md" />
              <input type="email" placeholder="Email" className="px-3 py-2 border border-gray-300 rounded-md" />
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Rolle auswählen</option>
                <option value="waiter">Kassierer</option>
                <option value="maker">Hersteller</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
              <button 
                className="md:col-span-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                onClick={() => showNotification('Benutzer hinzugefügt', 'success')}
              >
                Benutzer hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-emerald-700 mb-4">Umsatzanalyse</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Gesamtumsatz</h4>
                <p className="text-2xl font-bold text-emerald-700">{totalRevenue.toFixed(2)} €</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Bestellungen heute</h4>
                <p className="text-2xl font-bold text-emerald-700">{ordersToday}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Durchschnittliche Wartezeit</h4>
                <p className="text-2xl font-bold text-emerald-700">{averageWaitTime.toFixed(1)} Min</p>
              </div>
            </div>
            
            {/* Simple chart visualization */}
            <div className="h-64 bg-gray-50 rounded-lg p-4 relative">
              <div className="absolute bottom-0 left-0 right-0 h-56 flex items-end justify-around">
                {[4, 6, 5, 8, 7, 10, 9].map((value, index) => (
                  <div key={index} className="w-8 bg-emerald-500 rounded-t" style={{ height: `${value * 10}px` }}></div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-around items-center text-xs text-gray-500">
                <span>Mo</span>
                <span>Di</span>
                <span>Mi</span>
                <span>Do</span>
                <span>Fr</span>
                <span>Sa</span>
                <span>So</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-emerald-700 mb-4">Beliebteste Crêpes</h3>
              
              <div className="space-y-4">
                {['Classic Nutella', 'Savory Ham & Cheese', 'Berry Delight', 'Green Tea Matcha', 'Tropical Dream'].map((crêpe, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/4">{crêpe}</div>
                    <div className="flex-grow mx-2">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${(index + 1) * 15}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right">{(index + 1) * 15}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-emerald-700 mb-4">Umsatz nach Tageszeit</h3>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-around">
                  {[3, 5, 7, 6, 8, 10, 9, 7].map((value, index) => (
                    <div key={index} className="w-8 bg-red-500 rounded-t" style={{ height: `${value * 10}px` }}></div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-around items-center text-xs text-gray-500">
                  <span>08:00</span>
                  <span>10:00</span>
                  <span>12:00</span>
                  <span>14:00</span>
                  <span>16:00</span>
                  <span>18:00</span>
                  <span>20:00</span>
                  <span>22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Admin View Component
const AdminView = ({ orders, users, totalRevenue, ordersToday, averageWaitTime, predefinedCrêpes, showNotification }) => {
  const [activeTab, setActiveTab] = useState('orders');
  
  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-emerald-800 mb-6 text-center">Admin Dashboard</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'orders' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
          }`}
        >
          Bestellungen
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'users' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
          }`}
        >
          Benutzer
        </button>
        <button 
          onClick={() => setActiveTab('analytics')} 
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'analytics' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
          }`}
        >
          Analysen
        </button>
        <button 
          onClick={() => setActiveTab('system')} 
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'system' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
          }`}
        >
          System
        </button>
      </div>
      
      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Alle Bestellungen</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Bestellnummer</th>
                  <th className="px-4 py-2 text-left">Kunde</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Uhrzeit</th>
                  <th className="px-4 py-2 text-right">Preis</th>
                  <th className="px-4 py-2 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">#{order.id}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status === 'queued' ? 'In Warteschlange' :
                         order.status === 'in-progress' ? 'In Bearbeitung' : 'Fertig'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(order.createdAt).toLocaleTimeString()}</td>
                    <td className="px-4 py-3 text-right">{(order.price || 0).toFixed(2)} €</td>
                    <td className="px-4 py-3 text-right">
                      <select 
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                        defaultValue={order.status}
                        onChange={(e) => {
                          showNotification(`Status von Bestellung #${order.id} geändert`, 'success');
                        }}
                      >
                        <option value="queued">In Warteschlange</option>
                        <option value="in-progress">In Bearbeitung</option>
                        <option value="ready">Fertig</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Benutzerverwaltung</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Rolle</th>
                  <th className="px-4 py-2 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3 text-right">
                      <select 
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                        defaultValue={user.role}
                        onChange={(e) => {
                          showNotification(`Rolle von ${user.name} geändert`, 'success');
                        }}
                      >
                        <option value="waiter">Kassierer</option>
                        <option value="maker">Hersteller</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-emerald-700 mb-2">Neuen Benutzer hinzufügen</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Name" className="px-3 py-2 border border-gray-300 rounded-md" />
              <input type="email" placeholder="Email" className="px-3 py-2 border border-gray-300 rounded-md" />
              <select className="px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Rolle auswählen</option>
                <option value="waiter">Kassierer</option>
                <option value="maker">Hersteller</option>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
              </select>
              <button 
                className="md:col-span-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                onClick={() => showNotification('Benutzer hinzugefügt', 'success')}
              >
                Benutzer hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-emerald-700 mb-4">Umsatzanalyse</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Gesamtumsatz</h4>
                <p className="text-2xl font-bold text-emerald-700">{totalRevenue.toFixed(2)} €</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Bestellungen heute</h4>
                <p className="text-2xl font-bold text-emerald-700">{ordersToday}</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-500">Durchschnittliche Wartezeit</h4>
                <p className="text-2xl font-bold text-emerald-700">{averageWaitTime.toFixed(1)} Min</p>
              </div>
            </div>
            
            {/* Simple chart visualization */}
            <div className="h-64 bg-gray-50 rounded-lg p-4 relative">
              <div className="absolute bottom-0 left-0 right-0 h-56 flex items-end justify-around">
                {[4, 6, 5, 8, 7, 10, 9].map((value, index) => (
                  <div key={index} className="w-8 bg-emerald-500 rounded-t" style={{ height: `${value * 10}px` }}></div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-around items-center text-xs text-gray-500">
                <span>Mo</span>
                <span>Di</span>
                <span>Mi</span>
                <span>Do</span>
                <span>Fr</span>
                <span>Sa</span>
                <span>So</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-emerald-700 mb-4">Beliebteste Crêpes</h3>
              
              <div className="space-y-4">
                {['Classic Nutella', 'Savory Ham & Cheese', 'Berry Delight', 'Green Tea Matcha', 'Tropical Dream'].map((crêpe, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-1/4">{crêpe}</div>
                    <div className="flex-grow mx-2">
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 rounded-full" 
                          style={{ width: `${(index + 1) * 15}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right">{(index + 1) * 15}%</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-emerald-700 mb-4">Umsatz nach Tageszeit</h3>
              
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-around">
                  {[3, 5, 7, 6, 8, 10, 9, 7].map((value, index) => (
                    <div key={index} className="w-8 bg-red-500 rounded-t" style={{ height: `${value * 10}px` }}></div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-10 flex justify-around items-center text-xs text-gray-500">
                  <span>08:00</span>
                  <span>10:00</span>
                  <span>12:00</span>
                  <span>14:00</span>
                  <span>16:00</span>
                  <span>18:00</span>
                  <span>20:00</span>
                  <span>22:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">Systemeinstellungen</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-emerald-700 mb-2">Allgemeine Einstellungen</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Standortname</label>
                  <input type="text" defaultValue="Crêpe Master Hauptstand" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Öffnungszeiten</label>
                  <input type="text" defaultValue="10:00 - 22:00" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Adresse</label>
                  <input type="text" defaultValue="Hauptstraße 123, 12345 Stadt" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Telefon</label>
                  <input type="text" defaultValue="+49 123 456789" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-emerald-700 mb-2">Menüverwaltung</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Zutaten</th>
                      <th className="px-4 py-2 text-right">Preis</th>
                      <th className="px-4 py-2 text-right">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predefinedCrêpes.map((crêpe, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{crêpe.name}</td>
                        <td className="px-4 py-3">{crêpe.ingredients.join(', ')}</td>
                        <td className="px-4 py-3 text-right">{crêpe.price.toFixed(2)} €</td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-emerald-600 hover:text-emerald-800 mr-2" onClick={() => showNotification(`Crêpe "${crêpe.name}" bearbeiten`, 'success')}>Bearbeiten</button>
                          <button className="text-red-600 hover:text-red-800" onClick={() => showNotification(`Crêpe "${crêpe.name}" löschen`, 'success')}>Löschen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4">
                <h5 className="text-md font-semibold text-emerald-700 mb-2">Neue Crêpe hinzufügen</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Name" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="text" placeholder="Zutaten (kommagetrennt)" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="number" placeholder="Preis" step="0.1" className="px-3 py-2 border border-gray-300 rounded-md" />
                  <button 
                    className="md:col-span-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    onClick={() => showNotification('Crêpe hinzugefügt', 'success')}
                  >
                    Crêpe hinzufügen
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                onClick={() => showNotification('Einstellungen gespeichert', 'success')}
              >
                Änderungen speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
