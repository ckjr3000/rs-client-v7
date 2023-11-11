<template>
  <div class="home">
      <p>
        The #Rebel Selves App is designed to make your selfies glitchy and fun!
      </p>

      <p>
        It was created by Charlotte Roe, an artist and developer based in Huddersfield, and Dr Dawn 
        Woolley, an artist and research fellow at Leeds Arts University.
      </p>

      <router-link to="/app">
        <button class="button-primary">Get the App</button>
      </router-link>
    

      <p>
        Dr Woolley researches gender and beauty ideals on social networking sites and in selfies. 
        The app was developed in response to the conclusions of her book <a href="#">Consuming the Body: Capitalism, 
        social media and commodification</a> (Bloomsbury, 2023). The book examines how advertising and 
        selfies impact on bodies, health, and gender norms, and the conclusion offers some creative ways 
        in which selfies might disrupt gender norms and beauty ideals. The creative ways include:
      </p>

      <h2>Movement / Action:</h2>
      <p>
        Rather than concentrate on how the body looks, selfies that capture activity by montaging multiple poses / actions 
        would show what the body can do.
      </p>

      <h2>Glitch / Blur / Pixelation:</h2>
      <p>
        Through montage, glitch, and visual obstructions in the form of overlay textures, frames and stickers, 
        selfies may represent bodies in ways that are difficult to decode. Individuals can be visible and masked, 
        preventing categorisation and comparison against white, ableist, thin, and heteronormative body ideals.
      </p>

      <h2>Queer Timelines:</h2>
      <p>
        Social networking sites encourage users to present their life as a series of Instagramable events in a Timeline. 
        Montaged selfies could disrupt the ‘eventification’ of life and also resist the message we should aim to 
        transform ourselves into a perfect, finished, and ideal body expressed in ‘before’ and ‘after’ photographs in advertising. 
        Instead, they would allow for fluid identities and more complex narratives. 
      </p>

      <h2>Multiplicity:</h2>
      <p>
        Meg-John Barker and Alex Iantaffi suggest that using both/and thinking will help us to escape the binarism of 
        either/or thinking that pits female against male, healthy against unhealthy, fat against thin, and good against bad 
        (Life Isn’t Binary: On Being Both, Beyond, and In-Between, Jessica Kingsley Publishers, 2019). In selfies we could 
        create montages or series of images showing different aspects of identity, lifestyle, pleasures, and displeasures. 
        They could also blend the self with different objects, places, and people, to give a complex impression of life in a moment in time.
      </p>
  </div>
</template>

<script>

</script>

<style scoped>
  .home {
    padding: 10px 20vw 10px 20vw;
  }

  @media only screen and (max-width: 1050px) {
      .home {
        padding: 10px 10vw 10px 10vw;
      }
  }

  @media only screen and (max-width: 357px) {
      .home {
        padding: 15px;
      }

      p {
        font-size: 18px;
      }
  }

</style>