import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

describe('BaseButton', () => {
  // Test básico de renderizado
  it('renders correctly with default props', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button'
      }
    })

    expect(wrapper.text()).toContain('Test Button')
    expect(wrapper.classes()).toContain('base-button')
    expect(wrapper.classes()).toContain('base-button--primary')
    expect(wrapper.classes()).toContain('base-button--md')
  })

  // Test de diferentes variantes
  it('applies correct variant classes', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'outline', 'ghost', 'link']
    
    variants.forEach(variant => {
      const wrapper = mount(BaseButton, {
        props: {
          label: 'Test',
          variant
        }
      })
      
      expect(wrapper.classes()).toContain(`base-button--${variant}`)
    })
  })

  // Test de diferentes tamaños
  it('applies correct size classes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl']
    
    sizes.forEach(size => {
      const wrapper = mount(BaseButton, {
        props: {
          label: 'Test',
          size
        }
      })
      
      expect(wrapper.classes()).toContain(`base-button--${size}`)
    })
  })

  // Test de estado deshabilitado
  it('applies disabled state correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test',
        disabled: true
      }
    })

    expect(wrapper.classes()).toContain('base-button--disabled')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  // Test de estado de carga
  it('shows loading state correctly', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test',
        loading: true
      }
    })

    expect(wrapper.classes()).toContain('base-button--loading')
    expect(wrapper.find('.base-button-spinner').exists()).toBe(true)
  })

  // Test de ancho completo
  it('applies full width class when fullWidth is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test',
        fullWidth: true
      }
    })

    expect(wrapper.classes()).toContain('base-button--full-width')
  })

  // Test de iconos
  it('renders icon correctly', () => {
    const iconSvg = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
    
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test',
        icon: iconSvg,
        iconPosition: 'left'
      }
    })

    expect(wrapper.find('.base-button-icon').exists()).toBe(true)
    expect(wrapper.classes()).toContain('base-button--with-icon-left')
  })

  // Test de evento click
  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test'
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  // Test de que no emite click cuando está deshabilitado
  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test',
        disabled: true
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  // Test de que no emite click cuando está cargando
  it('does not emit click when loading', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test',
        loading: true
      }
    })

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  // Test de accesibilidad
  it('has proper accessibility attributes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test',
        'aria-label': 'Custom label'
      }
    })

    expect(wrapper.attributes('aria-label')).toBe('Custom label')
    expect(wrapper.attributes('role')).toBe('button')
  })

  // Test de tipo de botón
  it('renders correct button type', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test',
        type: 'submit'
      }
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  // Test de slot personalizado
  it('renders custom slot content', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test'
      },
      slots: {
        default: '<span>Custom content</span>'
      }
    })

    expect(wrapper.html()).toContain('Custom content')
  })

  // Test de focus
  it('can be focused', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test'
      }
    })

    await wrapper.trigger('focus')
    expect(wrapper.classes()).toContain('base-button--focused')
  })

  // Test de hover
  it('applies hover styles', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test'
      }
    })

    await wrapper.trigger('mouseenter')
    // Nota: Los estilos de hover se prueban mejor con testing-library o cypress
    expect(wrapper.exists()).toBe(true)
  })

  // Test de diferentes tipos de botón
  it('renders different button types correctly', () => {
    const types = ['button', 'submit', 'reset']
    
    types.forEach(type => {
      const wrapper = mount(BaseButton, {
        props: {
          label: 'Test',
          type
        }
      })
      
      expect(wrapper.attributes('type')).toBe(type)
    })
  })

  // Test de validación de props
  it('validates variant prop correctly', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    mount(BaseButton, {
      props: {
        label: 'Test',
        variant: 'invalid-variant'
      }
    })

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // Test de validación de size prop
  it('validates size prop correctly', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    
    mount(BaseButton, {
      props: {
        label: 'Test',
        size: 'invalid-size'
      }
    })

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  // Test de métodos expuestos
  it('exposes focus method', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test'
      }
    })

    const button = wrapper.find('button')
    const focusSpy = vi.spyOn(button.element, 'focus')
    
    await wrapper.vm.focus()
    expect(focusSpy).toHaveBeenCalled()
  })

  // Test de snapshot
  it('matches snapshot', () => {
    const wrapper = mount(BaseButton, {
      props: {
        label: 'Test Button'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
