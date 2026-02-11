// server/server.js - Express.js backend server
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and/or KEY not set in environment variables.');
  process.exit(1);
}
// 使用服务角色键创建客户端（绕过后端的RLS限制）
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Routes

// Get all pets
app.get('/api/pets', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ error: 'Error fetching pets' });
  }
});

// Get pet by ID
app.get('/api/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching pet:', error);
    res.status(500).json({ error: 'Error fetching pet' });
  }
});

// Get user's favorite pets
app.get('/api/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // First, get the user's favorite pet IDs
    const { data: favoriteData, error: favError } = await supabase
      .from('favorites')
      .select('pet_id')
      .eq('user_id', userId);
    
    if (favError) {
      console.error('Supabase error fetching favorites:', favError);
      return res.status(500).json({ error: favError.message });
    }
    
    if (!favoriteData || favoriteData.length === 0) {
      return res.json([]); // Return empty array if no favorites
    }
    
    // Extract pet IDs from favorites
    const petIds = favoriteData.map(fav => fav.pet_id);
    
    // Then, get the pet details for those IDs
    const { data: pets, error: petError } = await supabase
      .from('pets')
      .select('*')
      .in('id', petIds);
    
    if (petError) {
      console.error('Supabase error fetching pets:', petError);
      return res.status(500).json({ error: petError.message });
    }
    
    res.json(pets);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add pet to favorites
app.post('/api/favorites', async (req, res) => {
  try {
    const { user_id, pet_id } = req.body;
    
    if (!user_id || !pet_id) {
      return res.status(400).json({ error: 'user_id and pet_id are required' });
    }
    
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id, pet_id }])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') { // Unique violation
        return res.status(409).json({ error: 'Favorite already exists' });
      }
      if (error.code === '42501') { // RLS policy violation
        return res.status(403).json({ error: 'Access denied: Row Level Security policy violation. Please check your Supabase RLS policies.' });
      }
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: error.message });
  }
});

// Remove pet from favorites
app.delete('/api/favorites/:userId/:petId', async (req, res) => {
  try {
    const { userId, petId } = req.params;
    const { error } = await supabase
      .from('favorites')
      .delete()
      .match({ user_id: userId, pet_id: petId });
    
    if (error) throw error;
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Error removing favorite' });
  }
});

// Submit adoption application
app.post('/api/applications', async (req, res) => {
  try {
    const { user_id, pet_id, pet_name, pet_image } = req.body;
    
    if (!user_id || !pet_id || !pet_name) {
      return res.status(400).json({ error: 'user_id, pet_id, and pet_name are required' });
    }
    
    // Check if application already exists
    const { data: existingApp, error: existingError } = await supabase
      .from('applications')
      .select()
      .match({ user_id, pet_id })
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Supabase error:', existingError);
      return res.status(500).json({ error: existingError.message });
    }
    
    if (existingApp) {
      return res.status(409).json({ error: 'Application already submitted' });
    }
    
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        user_id,
        pet_id,
        pet_name,
        pet_image,
        status: '审核中'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    // Create a notification message
    const { error: msgError } = await supabase
      .from('messages')
      .insert([{
        user_id,
        title: '申请提交成功',
        content: `您对"${pet_name}"的领养申请已成功提交，请耐心等待审核。`,
        type: 'system'
      }]);
    
    if (msgError) {
      console.error('Error creating message:', msgError);
      // Don't fail the request if message creation fails
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's applications
app.get('/api/applications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's messages
app.get('/api/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Mark message as read
app.patch('/api/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { is_read } = req.body;
    
    const { data, error } = await supabase
      .from('messages')
      .update({ is_read })
      .eq('id', messageId)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Error updating message' });
  }
});

// Add a new pet (admin/shelter only)
app.post('/api/pets', async (req, res) => {
  try {
    const petData = req.body;
    
    // Validate required fields
    if (!petData.name || !petData.breed || !petData.image) {
      return res.status(400).json({ error: 'Missing required fields: name, breed, and image are required' });
    }
    
    const { data, error } = await supabase
      .from('pets')
      .insert([{
        name: petData.name,
        breed: petData.breed,
        age: petData.age || null,
        gender: petData.gender || null,
        location: petData.location || null,
        distance: petData.distance || null,
        image: petData.image,
        category: petData.category || 'other',
        description: petData.description || '',
        vaccinated: petData.vaccinated || false,
        neutered: petData.neutered || false,
        status: petData.status || 'available',
        tags: petData.tags || [],
        gallery: petData.gallery || [],
        shelter_id: petData.shelter_id || null // Would normally come from authenticated shelter
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding pet:', error);
    res.status(500).json({ error: 'Error adding pet' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});